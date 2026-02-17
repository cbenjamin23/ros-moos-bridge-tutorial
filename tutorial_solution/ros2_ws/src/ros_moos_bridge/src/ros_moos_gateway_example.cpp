/**
 * ROS2 to MOOS Gateway
 * Auto-generated bridge code
 * 
 * Topics:
 *   /odom (Odometry)
 * 
 * Mappings:
 *   /odom::pose.pose.position.x -> NAV_X
 *   /odom::pose.pose.position.y -> NAV_Y
 *   /odom::__yaw_from_quat__ -> NAV_YAW
 *   /odom::__speed_from_twist__ -> NAV_SPEED
 */

// ============================================================================
// Includes
// ============================================================================
#include <rclcpp/rclcpp.hpp>
#include "MOOS/libMOOS/Comms/MOOSCommClient.h"
#include <functional>
#include <cmath>
#include <chrono>
#include <nav_msgs/msg/odometry.hpp>

// ============================================================================
// Helper Functions
// ============================================================================

// Convert quaternion to yaw angle (radians)
inline double quaternion_to_yaw(double x, double y, double z, double w) {
    double siny_cosp = 2.0 * (w * z + x * y);
    double cosy_cosp = 1.0 - 2.0 * (y * y + z * z);
    return std::atan2(siny_cosp, cosy_cosp);
}

// Calculate speed magnitude from twist
inline double twist_to_speed(double vx, double vy) {
    return std::sqrt(vx * vx + vy * vy);
}

// ============================================================================
// ROS-MOOS Gateway Node
// ============================================================================
class RosMoosGateway : public rclcpp::Node {
public:
    RosMoosGateway() : Node("ros_moos_gateway") {
        // MOOS connection parameters
        std::string moos_host = this->declare_parameter("moos_host", "localhost");
        int moos_port = this->declare_parameter("moos_port", 9000);
        std::string moos_name = this->declare_parameter("moos_name", "ROS_MOOS_Gateway");
        
        // Initialize MOOS connection
        comms_.SetOnConnectCallBack(on_moos_connect, this);
        comms_.Run(moos_host.c_str(), moos_port, moos_name.c_str());
        
        // Setup subscriptions
        // Subscribe to /odom (Odometry)
        sub_odom_ = this->create_subscription<nav_msgs::msg::Odometry>(
            "/odom", rclcpp::QoS(10),
            std::bind(&RosMoosGateway::odom_cb, this, std::placeholders::_1));


        // Stale detection parameters
        stale_timeout_ms_ = this->declare_parameter<int>("stale_timeout_ms", 1000);
        stale_timer_ = this->create_wall_timer(
            std::chrono::milliseconds(100),
            std::bind(&RosMoosGateway::stale_check_cb, this));
        
        // Initialize have_<topic> flags (all start false/stale)
        have_last_odom_time_ = false;
        
        RCLCPP_INFO(this->get_logger(), 
            "ROS2-MOOS Gateway initialized: %s:%d (%s), %zu topic(s), %zu mapping(s)",
            moos_host.c_str(), moos_port, moos_name.c_str(), 
            1ul, 4ul);
    }
    
private:
    CMOOSCommClient comms_;
    
    // Subscription members
    rclcpp::Subscription<nav_msgs::msg::Odometry>::SharedPtr sub_odom_;
    rclcpp::Time last_odom_time_;
    bool have_last_odom_time_;
    rclcpp::TimerBase::SharedPtr stale_timer_;
    int stale_timeout_ms_;
    
    // MOOS connection callback
    static bool on_moos_connect(void* param) {
        auto* self = static_cast<RosMoosGateway*>(param);
        RCLCPP_INFO(self->get_logger(), "Connected to MOOSDB");
        return true;
    }

    // ========================================================================
    // Callbacks
    // ========================================================================

    // Callback for /odom -> NAV_X, NAV_Y, NAV_YAW, NAV_SPEED
    void odom_cb(const nav_msgs::msg::Odometry::SharedPtr msg) {
        comms_.Notify("NAV_X", msg->pose.pose.position.x);
        comms_.Notify("NAV_Y", msg->pose.pose.position.y);
        comms_.Notify("NAV_YAW", quaternion_to_yaw(
            msg->pose.pose.orientation.x,
            msg->pose.pose.orientation.y,
            msg->pose.pose.orientation.z,
            msg->pose.pose.orientation.w));
        comms_.Notify("NAV_SPEED", twist_to_speed(msg->twist.twist.linear.x, msg->twist.twist.linear.y));
        last_odom_time_ = this->now();
        have_last_odom_time_ = true;
    }

    // Timer callback for stale data detection
    void stale_check_cb() {
        if (!have_last_odom_time_) {
            comms_.Notify("ODOM_STALE", "true");
        } else {
            double age_sec = (this->now() - last_odom_time_).seconds();
            double timeout_sec = stale_timeout_ms_ / 1000.0;
            comms_.Notify("ODOM_STALE", age_sec > timeout_sec ? "true" : "false");
        }
    }
};

// ============================================================================
// Main
// ============================================================================
int main(int argc, char** argv) {
    rclcpp::init(argc, argv);
    
    try {
        auto node = std::make_shared<RosMoosGateway>();
        rclcpp::spin(node);
    } catch (const std::exception& e) {
        RCLCPP_ERROR(rclcpp::get_logger("ros_moos_gateway"), "Exception: %s", e.what());
        return 1;
    }
    
    rclcpp::shutdown();
    return 0;
}

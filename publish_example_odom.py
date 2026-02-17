#!/usr/bin/env python3
"""
Publish example Odometry data for ros_moos_gateway_example.cpp.

This script publishes nav_msgs/msg/Odometry on /odom so the gateway can map:
  - pose.pose.position.x -> NAV_X
  - pose.pose.position.y -> NAV_Y
  - yaw from quaternion -> NAV_YAW
  - speed from twist linear x/y -> NAV_SPEED
"""

import math

import rclpy
from nav_msgs.msg import Odometry
from rclpy.node import Node


class ExampleOdomPublisher(Node):
    def __init__(self) -> None:
        super().__init__("example_odom_publisher")
        self.publisher = self.create_publisher(Odometry, "/odom", 10)
        self.timer_period = 0.1  # 10 Hz
        self.timer = self.create_timer(self.timer_period, self._publish_odom)
        self.t = 0.0
        self.get_logger().info("Publishing example Odometry on /odom at 10 Hz")

    def _publish_odom(self) -> None:
        # Generate smooth circular motion for test data.
        radius = 10.0
        angular_rate = 0.2  # rad/s
        x = radius * math.cos(angular_rate * self.t)
        y = radius * math.sin(angular_rate * self.t)
        vx = -radius * angular_rate * math.sin(angular_rate * self.t)
        vy = radius * angular_rate * math.cos(angular_rate * self.t)
        yaw = math.atan2(vy, vx)

        qz = math.sin(yaw / 2.0)
        qw = math.cos(yaw / 2.0)

        msg = Odometry()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.header.frame_id = "map"
        msg.child_frame_id = "base_link"

        msg.pose.pose.position.x = x
        msg.pose.pose.position.y = y
        msg.pose.pose.position.z = 0.0
        msg.pose.pose.orientation.x = 0.0
        msg.pose.pose.orientation.y = 0.0
        msg.pose.pose.orientation.z = qz
        msg.pose.pose.orientation.w = qw

        msg.twist.twist.linear.x = vx
        msg.twist.twist.linear.y = vy
        msg.twist.twist.linear.z = 0.0
        msg.twist.twist.angular.x = 0.0
        msg.twist.twist.angular.y = 0.0
        msg.twist.twist.angular.z = angular_rate

        self.publisher.publish(msg)
        self.t += self.timer_period


def main(args=None) -> None:
    rclpy.init(args=args)
    node = ExampleOdomPublisher()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()

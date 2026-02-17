#!/usr/bin/env bash
set -euo pipefail

# Publish a single Odometry sample on /odom.
# Values map to:
#   NAV_X, NAV_Y from pose.position.x/y
#   NAV_YAW from pose.orientation (yaw ~= 0.785 rad)
#   NAV_SPEED from twist.linear.x/y (speed ~= 1.118)
ros2 topic pub --once /odom nav_msgs/msg/Odometry "{
  header: {frame_id: 'map'},
  child_frame_id: 'base_link',
  pose: {
    pose: {
      position: {x: 12.5, y: -3.2, z: 0.0},
      orientation: {x: 0.0, y: 0.0, z: 0.38268343, w: 0.92387953}
    }
  },
  twist: {
    twist: {
      linear: {x: 1.0, y: 0.5, z: 0.0},
      angular: {x: 0.0, y: 0.0, z: 0.2}
    }
  }
}"

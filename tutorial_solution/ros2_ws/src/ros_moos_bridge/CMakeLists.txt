cmake_minimum_required(VERSION 3.8)
project(ros_moos_bridge)

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
# Add one find_package(...) per ROS interface package used by your generated .cpp.
# This tutorial example maps /odom (nav_msgs/msg/Odometry), so nav_msgs is required.
find_package(nav_msgs REQUIRED)

# MOOS is not a ROS package, so find it via headers/libs on your system.
# You can override these at build time with:
#   --cmake-args -DMOOS_INCLUDE_DIR=/path/include -DMOOS_LIBRARY=/path/libMOOS.so
find_path(MOOS_INCLUDE_DIR
  NAMES MOOS/libMOOS/Comms/MOOSCommClient.h
  HINTS
    $ENV{MOOS_INCLUDE_DIR}
    $ENV{HOME}/moos-ivp/MOOS_Jul0519/MOOSCore
    /usr/local/include
    /usr/include
)

find_library(MOOS_LIBRARY
  NAMES MOOS
  HINTS
    $ENV{MOOS_LIBRARY_DIR}
    $ENV{HOME}/moos-ivp/MOOS_Jul0519/MOOSCore/Core/libMOOS
    /usr/local/lib
    /usr/lib
)

if(NOT MOOS_INCLUDE_DIR)
  message(FATAL_ERROR "Could not find MOOS headers. Set MOOS_INCLUDE_DIR or install MOOS headers.")
endif()

if(NOT MOOS_LIBRARY)
  message(FATAL_ERROR "Could not find libMOOS. Set MOOS_LIBRARY or MOOS_LIBRARY_DIR.")
endif()

add_executable(ros_moos_gateway_example src/ros_moos_gateway_example.cpp)
# Keep rclcpp + message packages aligned with the generated source includes.
ament_target_dependencies(ros_moos_gateway_example rclcpp nav_msgs)
target_include_directories(ros_moos_gateway_example PRIVATE ${MOOS_INCLUDE_DIR})
target_link_libraries(ros_moos_gateway_example ${MOOS_LIBRARY})

install(TARGETS ros_moos_gateway_example
  DESTINATION lib/${PROJECT_NAME}
)

ament_package()

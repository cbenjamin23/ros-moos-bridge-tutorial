# ROS 2 to MOOS Bridge Tutorial (Linux)

Goal: generate a ROS 2 C++ gateway node from the website, build it, run it against MOOSDB on port `9000`, and test with `/odom` publishers.

Website: <https://ros-moos-bridge.base44.app/Home>

## 1) Create a fresh tutorial workspace

```bash
mkdir -p ~/ros_moos_gateway_tutorial/ros2_ws/src
cd ~/ros_moos_gateway_tutorial
cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/publish_example_odom_once.sh .
cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/publish_example_odom.py .
chmod +x ./publish_example_odom_once.sh
```

## 2) Open terminals and source ROS 2 once per terminal

You only need to run this once when you open a terminal:

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
```

Use three terminals:

- Terminal A: MOOS mission
- Terminal B: ROS 2 gateway
- Terminal C: test publisher

## 3) Create the ROS 2 package

Run in Terminal B:

```bash
cd ~/ros_moos_gateway_tutorial/ros2_ws/src
ros2 pkg create ros_moos_bridge --build-type ament_cmake --dependencies rclcpp nav_msgs
```

## 4) Generate and place gateway C++

Generate `ros_moos_gateway_example.cpp` from the website and save it to:

```bash
~/ros_moos_gateway_tutorial/ros2_ws/src/ros_moos_bridge/src/ros_moos_gateway_example.cpp
```

If needed, use this repo's reference file:

```bash
cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/ros_moos_gateway_example.cpp \
  ~/ros_moos_gateway_tutorial/ros2_ws/src/ros_moos_bridge/src/ros_moos_gateway_example.cpp
```

## 5) Manually edit `CMakeLists.txt` (learning step)

Edit:

```bash
~/ros_moos_gateway_tutorial/ros2_ws/src/ros_moos_bridge/CMakeLists.txt
```

Key changes you should make:

- `find_package(nav_msgs REQUIRED)` (because this example uses `nav_msgs/msg/Odometry`)
- `find_path(...)` for `MOOS/libMOOS/Comms/MOOSCommClient.h`
- `find_library(...)` for `MOOS`
- `add_executable(ros_moos_gateway_example src/ros_moos_gateway_example.cpp)`
- `ament_target_dependencies(... rclcpp nav_msgs)`
- `target_include_directories(... ${MOOS_INCLUDE_DIR})`
- `target_link_libraries(... ${MOOS_LIBRARY})`
- `install(TARGETS ...)`

You can compare your final file to:

```bash
/Users/charlesbenjamin/ros-moos-bridge-tutorial/tutorial_solution/ros2_ws/src/ros_moos_bridge/CMakeLists.txt
```

## 6) Manually edit `package.xml` (learning step)

Edit:

```bash
~/ros_moos_gateway_tutorial/ros2_ws/src/ros_moos_bridge/package.xml
```

Make sure it has:

- `<buildtool_depend>ament_cmake</buildtool_depend>`
- `<depend>rclcpp</depend>`
- `<depend>nav_msgs</depend>`

Reference:

```bash
/Users/charlesbenjamin/ros-moos-bridge-tutorial/tutorial_solution/ros2_ws/src/ros_moos_bridge/package.xml
```

## 7) Build

Run in Terminal B:

```bash
cd ~/ros_moos_gateway_tutorial/ros2_ws
colcon build --packages-select ros_moos_bridge
source ~/ros_moos_gateway_tutorial/ros2_ws/install/setup.bash
```

If MOOS is not found, build with explicit paths (example matching your layout style):

```bash
colcon build --packages-select ros_moos_bridge --cmake-args \
  -DMOOS_INCLUDE_DIR=/Users/charlesbenjamin/moos-ivp/MOOS_Jul0519/MOOSCore \
  -DMOOS_LIBRARY=/Users/charlesbenjamin/moos-ivp/MOOS_Jul0519/MOOSCore/Core/libMOOS/libMOOS.so
```

## 8) Run

Terminal A:

```bash
pAntler /path/to/your_mission.moos
```

Terminal B (no params needed because defaults are already `localhost:9000`):

```bash
ros2 run ros_moos_bridge ros_moos_gateway_example
```

Optional override only if needed:

```bash
ros2 run ros_moos_bridge ros_moos_gateway_example --ros-args -p moos_host:=localhost -p moos_port:=9000
```

## 9) Inject test `/odom` data

Terminal C, one-shot:

```bash
cd ~/ros_moos_gateway_tutorial
./publish_example_odom_once.sh
```

Terminal C, continuous:

```bash
cd ~/ros_moos_gateway_tutorial
python3 ./publish_example_odom.py
```

## 10) Verify in MOOS

Confirm these update:

- `NAV_X`
- `NAV_Y`
- `NAV_YAW`
- `NAV_SPEED`
- `ODOM_STALE`

## Adapting to other generated mappings

Most build logic stays the same. The part that changes is ROS message dependencies:

- Add/remove message packages in `find_package(...)` and `ament_target_dependencies(...)`.
- Mirror the same packages in `package.xml` as `<depend>...</depend>`.

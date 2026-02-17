# ROS 2 to MOOS Bridge Tutorial (Linux)

This tutorial is for Linux ROS 2 setups (typically Ubuntu + ROS 2 Humble/Iron/Jazzy).

Website: <https://ros-moos-bridge.base44.app/Home>

## What `source /opt/ros/<distro>/setup.bash` does

It loads the ROS 2 environment into your current shell:

- Adds ROS 2 tools like `ros2` to your `PATH`.
- Sets package discovery variables used by build tools and runtime.
- Makes ROS 2 interfaces and libraries discoverable for `colcon` and your node.

You need this even if your code is in this repo because ROS 2 itself is installed system-wide under `/opt/ros/...`.

## What is constant vs variable in `CMakeLists.txt` / `package.xml`

The following pattern is consistent across generated ROS2->MOOS gateway nodes:

- Always use `ament_cmake`.
- Always depend on `rclcpp`.
- Always build one executable from your generated `.cpp`.
- Always find/include/link MOOS (`MOOSCommClient.h` + `libMOOS`).
- Always install the executable with `install(TARGETS ...)`.

What changes with message types/topic mappings:

- ROS message package dependencies (for example `nav_msgs`, `geometry_msgs`, `sensor_msgs`).
- Those dependencies must be updated in both:
  - `CMakeLists.txt` (`find_package(...)` and `ament_target_dependencies(...)`)
  - `package.xml` (`<depend>...</depend>`)

For this tutorial's generated file, `/odom` uses `nav_msgs/msg/Odometry`, so `nav_msgs` is included.

## From-Scratch Tutorial (Exact Flow)

### 0) Create a fresh tutorial folder and workspace

You can place this folder anywhere. `~/ros_moos_gateway_tutorial` is just an example path.

```bash
mkdir -p ~/ros_moos_gateway_tutorial/ros2_ws/src
cd ~/ros_moos_gateway_tutorial
```

### 1) Prepare helper test publishers in your tutorial folder

```bash
cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/publish_example_odom_once.sh ~/ros_moos_gateway_tutorial/
cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/publish_example_odom.py ~/ros_moos_gateway_tutorial/
chmod +x ~/ros_moos_gateway_tutorial/publish_example_odom_once.sh
```

### 2) Create the ROS 2 package from scratch

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
cd ~/ros_moos_gateway_tutorial/ros2_ws/src
ros2 pkg create ros_moos_bridge --build-type ament_cmake --dependencies rclcpp nav_msgs
```

### 3) Generate your gateway C++ on the website and paste it

Generate `ros_moos_gateway_example.cpp`, then place it at:

```bash
~/ros_moos_gateway_tutorial/ros2_ws/src/ros_moos_bridge/src/ros_moos_gateway_example.cpp
```

If you want to use this repo's reference generated file:

```bash
cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/ros_moos_gateway_example.cpp \
  ~/ros_moos_gateway_tutorial/ros2_ws/src/ros_moos_bridge/src/ros_moos_gateway_example.cpp
```

### 4) Replace `CMakeLists.txt` and `package.xml` with tutorial templates

```bash
cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/tutorial/ros2_ws/src/ros_moos_bridge/CMakeLists.txt \
  ~/ros_moos_gateway_tutorial/ros2_ws/src/ros_moos_bridge/CMakeLists.txt

cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/tutorial/ros2_ws/src/ros_moos_bridge/package.xml \
  ~/ros_moos_gateway_tutorial/ros2_ws/src/ros_moos_bridge/package.xml
```

### 5) Build

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
cd ~/ros_moos_gateway_tutorial/ros2_ws
colcon build --packages-select ros_moos_bridge
```

If MOOS is not in default Linux paths, pass explicit paths:

```bash
colcon build --packages-select ros_moos_bridge --cmake-args \
  -DMOOS_INCLUDE_DIR=/path/to/moos/include \
  -DMOOS_LIBRARY=/path/to/libMOOS.so
```

### 6) Run MOOSDB first, then the ROS 2 gateway

Terminal A:

```bash
pAntler /path/to/your_mission.moos
```

Terminal B:

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
source ~/ros_moos_gateway_tutorial/ros2_ws/install/setup.bash
ros2 run ros_moos_bridge ros_moos_gateway_example --ros-args \
  -p moos_host:=localhost \
  -p moos_port:=9000 \
  -p moos_name:=ROS_MOOS_Gateway
```

### 7) Inject `/odom` data (pick one)

Terminal C, publish once:

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
source ~/ros_moos_gateway_tutorial/ros2_ws/install/setup.bash
~/ros_moos_gateway_tutorial/publish_example_odom_once.sh
```

Terminal C, publish continuously:

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
source ~/ros_moos_gateway_tutorial/ros2_ws/install/setup.bash
python3 ~/ros_moos_gateway_tutorial/publish_example_odom.py
```

### 8) Verify on MOOS side

Check that these variables update:

- `NAV_X`
- `NAV_Y`
- `NAV_YAW`
- `NAV_SPEED`
- `ODOM_STALE`

## Fallback: Known-Good Solution Package

If your manual package fails, copy the reference solution package:

```bash
mkdir -p ~/ros_moos_gateway_tutorial/ros2_ws/src
cp -R /Users/charlesbenjamin/ros-moos-bridge-tutorial/tutorial_solution/ros2_ws/src/ros_moos_bridge \
  ~/ros_moos_gateway_tutorial/ros2_ws/src/
```

Then build/run using Steps 5-7 above.

## Troubleshooting

- `MOOSCommClient.h` not found:
  - Build with `-DMOOS_INCLUDE_DIR=...`.
- `libMOOS.so` not found at link time:
  - Build with `-DMOOS_LIBRARY=...`.
- Gateway starts but no MOOS updates:
  - Confirm MOOSDB is running on `localhost:9000`.
  - Confirm `/odom` messages exist: `ros2 topic echo /odom`.

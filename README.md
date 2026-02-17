# ROS 2 to MOOS Bridge Tutorial

This repo gives you a complete tutorial for the exact workflow you described:

1. Generate `ros_moos_gateway_example.cpp` from the website.
2. Create a ROS 2 C++ package.
3. Paste the generated gateway code into the package.
4. Fix `CMakeLists.txt` and `package.xml`.
5. Build and run the node against a MOOSDB on port `9000`.
6. Inject test `/odom` data with either a one-shot Bash script or a continuous Python publisher.

Website: <https://ros-moos-bridge.base44.app/Home>

## Repo Layout

- `ros_moos_gateway_example.cpp`: reference generated gateway code.
- `publish_example_odom_once.sh`: one-shot ROS 2 `/odom` publisher.
- `publish_example_odom.py`: continuous ROS 2 `/odom` publisher.
- `tutorial/`: manual tutorial scaffold (you still paste your generated C++ file).
- `tutorial_solution/`: known-good complete package.

## Prerequisites

- ROS 2 installed (Humble or newer).
- `colcon` available.
- MOOS/MOOS-IvP installed (headers + `libMOOS`).
- A MOOS mission that starts MOOSDB on port `9000`.

## Manual Tutorial (Primary Path)

### 1) Create a ROS 2 workspace and package

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src
ros2 pkg create ros_moos_bridge --build-type ament_cmake --dependencies rclcpp nav_msgs
```

### 2) Generate and paste the gateway C++ from the website

Use the generator and produce `ros_moos_gateway_example.cpp`.

Place it here:

```bash
~/ros2_ws/src/ros_moos_bridge/src/ros_moos_gateway_example.cpp
```

If you want to use the reference file from this repo:

```bash
cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/ros_moos_gateway_example.cpp \
  ~/ros2_ws/src/ros_moos_bridge/src/ros_moos_gateway_example.cpp
```

### 3) Replace `CMakeLists.txt` and `package.xml`

Use the prepared tutorial versions:

```bash
cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/tutorial/ros2_ws/src/ros_moos_bridge/CMakeLists.txt \
  ~/ros2_ws/src/ros_moos_bridge/CMakeLists.txt

cp /Users/charlesbenjamin/ros-moos-bridge-tutorial/tutorial/ros2_ws/src/ros_moos_bridge/package.xml \
  ~/ros2_ws/src/ros_moos_bridge/package.xml
```

### 4) Build the package

```bash
cd ~/ros2_ws
source /opt/ros/<your_ros2_distro>/setup.bash
colcon build --packages-select ros_moos_bridge
```

If MOOS is not in a default include/lib location, build with explicit paths:

```bash
colcon build --packages-select ros_moos_bridge --cmake-args \
  -DMOOS_INCLUDE_DIR=/path/to/moos/include \
  -DMOOS_LIBRARY=/path/to/libMOOS.so
```

On macOS, use the same build command with a `.dylib`, for example:

```bash
colcon build --packages-select ros_moos_bridge --cmake-args \
  -DMOOS_INCLUDE_DIR=/usr/local/include \
  -DMOOS_LIBRARY=/usr/local/lib/libMOOS.dylib
```

### 5) Run MOOS and the ROS 2 gateway node

Terminal A (MOOS mission; must expose MOOSDB on `9000`):

```bash
pAntler /path/to/your_mission.moos
```

Terminal B (ROS 2 gateway):

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
source ~/ros2_ws/install/setup.bash
ros2 run ros_moos_bridge ros_moos_gateway_example --ros-args \
  -p moos_host:=localhost \
  -p moos_port:=9000 \
  -p moos_name:=ROS_MOOS_Gateway
```

### 6) Inject ROS 2 odometry data

Terminal C (option 1: publish once):

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
source ~/ros2_ws/install/setup.bash
/Users/charlesbenjamin/ros-moos-bridge-tutorial/publish_example_odom_once.sh
```

Terminal C (option 2: publish continuously at 10 Hz):

```bash
source /opt/ros/<your_ros2_distro>/setup.bash
source ~/ros2_ws/install/setup.bash
python3 /Users/charlesbenjamin/ros-moos-bridge-tutorial/publish_example_odom.py
```

### 7) Verify expected MOOS variables

With your MOOS monitoring tools, verify updates for:

- `NAV_X`
- `NAV_Y`
- `NAV_YAW`
- `NAV_SPEED`
- `ODOM_STALE`

## Tutorial Solution Folder (Fallback / Diff Target)

If your manual package setup fails, copy the known-good solution package:

```bash
mkdir -p ~/ros2_ws/src
cp -R /Users/charlesbenjamin/ros-moos-bridge-tutorial/tutorial_solution/ros2_ws/src/ros_moos_bridge \
  ~/ros2_ws/src/
```

Then build/run with the same commands from steps 4-6.

## Troubleshooting

- Build fails with `MOOS/libMOOS/Comms/MOOSCommClient.h` not found:
  - Set `MOOS_INCLUDE_DIR` explicitly in `colcon build --cmake-args`.
- Linker fails with `MOOS` not found:
  - Set `MOOS_LIBRARY` explicitly to full path of `libMOOS.so`/`libMOOS.dylib`.
- Gateway runs but no MOOS updates:
  - Confirm MOOSDB is actually on `localhost:9000`.
  - Confirm you are publishing `nav_msgs/msg/Odometry` on `/odom`.

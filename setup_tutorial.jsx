import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Package, Terminal, FileCode, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

export default function SetupTutorial() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to={createPageUrl('Home')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Setup Tutorial</h1>
              <p className="text-sm text-slate-600 dark:text-slate-500">Integrate the bridge into your workspace</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Prerequisites */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Prerequisites</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-300/75 dark:border-slate-700/75 p-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">ROS2 Installation</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">ROS2 Humble or later (tested on Humble/Iron)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">MOOS-IvP</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">MOOS-IvP installed and accessible (libMOOS in your path)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">Running MOOSDB</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A MOOSDB instance must be running and accessible (via a *.moos mission file)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">C++ Build Tools</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">colcon, CMake 3.8+, C++14 compiler</p>
                </div>
              </div>
            </div>
          </section>

          {/* Step 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700 dark:text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Generate Bridge Code</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-300/75 dark:border-slate-700/75 p-6 space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Use the <strong className="text-slate-900 dark:text-white">ROS → MOOS</strong> or <strong className="text-slate-900 dark:text-white">MOOS → ROS</strong> generator 
                to configure your mappings and download the generated <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-blue-600 dark:text-blue-400 text-sm">*.cpp</code> file.
              </p>
              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-slate-700 dark:text-slate-400">
                  💡 <strong className="text-slate-900 dark:text-white">Tip:</strong> Start with a predefined mapping pack to get familiar with the structure.
                </p>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700 dark:text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Create ROS2 Package</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-300/75 dark:border-slate-700/75 p-6 space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Create a new ROS2 package in your workspace:
              </p>
              <div className="bg-slate-100 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-500"># Navigate to your workspace</div>
                <div className="text-slate-800 dark:text-slate-300">cd ~/ros2_ws/src</div>
                <div className="text-slate-500 dark:text-slate-500 mt-2"># Create package</div>
                <div className="text-slate-800 dark:text-slate-300">ros2 pkg create ros_moos_bridge --build-type ament_cmake --dependencies rclcpp std_msgs</div>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                Place your generated <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-blue-600 dark:text-blue-400 text-sm">.cpp</code> file 
                in <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 text-sm">ros_moos_bridge/src/</code>
              </p>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700 dark:text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Configure CMakeLists.txt</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-300/75 dark:border-slate-700/75 p-6 space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Update your <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 text-sm">ros2_ws/src/ros_moos_bridge/CMakeLists.txt</code> to link MOOS and build the executable:
              </p>
              <div className="bg-slate-100 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm border border-slate-200 dark:border-slate-800">
                <pre className="text-slate-700 dark:text-slate-300 whitespace-pre">{`cmake_minimum_required(VERSION 3.8)
project(ros_moos_bridge)

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)

# Find MOOS
find_library(MOOS_LIB MOOS HINTS /usr/local/lib)
find_path(MOOS_INCLUDE MOOS/libMOOS HINTS /usr/local/include)

add_executable(ros_to_moos_gateway src/ros_moos_gateway.cpp)
target_include_directories(ros_to_moos_gateway PUBLIC \${MOOS_INCLUDE})
target_link_libraries(ros_to_moos_gateway \${MOOS_LIB})
ament_target_dependencies(ros_to_moos_gateway rclcpp std_msgs)

install(TARGETS ros_to_moos_gateway DESTINATION lib/\${PROJECT_NAME})

ament_package()`}</pre>
              </div>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700 dark:text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Build and Run</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-300/75 dark:border-slate-700/75 p-6 space-y-4">
              <p className="text-slate-700 dark:text-slate-300">Build your workspace and launch the gateway:</p>
              <div className="bg-slate-100 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-3 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-slate-500 dark:text-slate-500"># Build</div>
                  <div className="text-slate-800 dark:text-slate-300">cd ~/ros2_ws</div>
                  <div className="text-slate-800 dark:text-slate-300">colcon build --packages-select ros_moos_bridge</div>
                  <div className="text-slate-800 dark:text-slate-300">source install/setup.bash</div>
                </div>
                <div className="mt-4">
                  <div className="text-slate-500 dark:text-slate-500"># Ensure MOOSDB is running first!</div>
                  <div className="text-slate-800 dark:text-slate-300">pAntler your_mission.moos</div>
                </div>
                <div className="mt-4">
                  <div className="text-slate-500 dark:text-slate-500"># Then run the gateway</div>
                  <div className="text-slate-800 dark:text-slate-300">ros2 run ros_moos_bridge ros_to_moos_gateway</div>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-amber-500 mt-4">
                <p className="text-sm text-slate-700 dark:text-slate-400">
                  ⚠️ <strong className="text-slate-900 dark:text-white">Important:</strong> The gateway requires a running MOOSDB instance. 
                  Start your MOOS mission before launching the gateway.
                </p>
              </div>
            </div>
          </section>

          {/* Step 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700 dark:text-white">5</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Test the Bridge</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-300/75 dark:border-slate-700/75 p-6 space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                You can test the bridge by manually publishing to ROS topics or MOOS variables:
              </p>
              
              <div className="space-y-3">
                <h4 className="text-slate-900 dark:text-white font-medium">For ROS → MOOS Bridge:</h4>
                <div className="bg-slate-100 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-500"># Publish to a ROS topic</div>
                  <div className="text-slate-800 dark:text-slate-300">ros2 topic pub /desired_heading std_msgs/msg/Float64 "data: 45.0"</div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Verify on the MOOS side with <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">uXMS</code> or 
                  <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-1">uPokeDB</code> to check that <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-1">DESIRED_HEADING</code> is updated.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-slate-900 dark:text-white font-medium">For MOOS → ROS Bridge:</h4>
                <div className="bg-slate-100 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-500"># Poke a MOOS variable</div>
                  <div className="text-slate-800 dark:text-slate-300">uPokeDB your_mission.moos DESIRED_HEADING=90.0</div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Verify on the ROS side with <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">ros2 topic echo /desired_heading</code> to check that the message is published.
                </p>
              </div>

              <div className="bg-emerald-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-emerald-500 mt-4">
                <p className="text-sm text-slate-700 dark:text-slate-400">
                  ✅ <strong className="text-slate-900 dark:text-white">Success indicator:</strong> You should see log messages in the gateway terminal 
                  when data flows through, and the values should appear on both sides of the bridge.
                </p>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Common Issues</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-300/75 dark:border-slate-700/75 divide-y divide-slate-200 dark:divide-slate-800">
              <div className="p-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">MOOS library not found</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Add MOOS include/lib paths explicitly:</p>
                <code className="text-xs bg-slate-200 dark:bg-slate-950 text-blue-600 dark:text-blue-400 px-3 py-2 rounded block border border-slate-300 dark:border-slate-800">
                  target_include_directories(... PUBLIC /path/to/moos/include)
                </code>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Connection refused to MOOSDB</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ensure MOOSDB is running and accessible. Check host/port parameters match your <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">*.moos</code> configuration.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">No data flowing</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Verify topic/variable names match exactly (case-sensitive). Use <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">ros2 topic echo</code> 
                  on the ROS side and <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">uMS</code> or <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">uPokeDB</code> 
                  on the MOOS side to verify variables.
                </p>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-6">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
              <li>• Add launch files to start the gateway node automatically with your system</li>
              <li>• Monitor performance and adjust polling rates if needed</li>
              <li>• Explore a complete example in the reference GitHub repository (coming soon)</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

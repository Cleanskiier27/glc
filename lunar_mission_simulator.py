#!/usr/bin/env python3
"""
Moonbase Alpha - Lunar Mission Simulator
NetworkBuster Space Division
"""

import time
import random
from datetime import datetime

class LunarSimulator:
    def __init__(self):
        self.gravity = 1.625  # m/s^2
        self.base_temp = -20  # Celsius (inside)
        self.power_level = 100.0  # Percentage
        self.network_latency = 1.3  # Seconds (to Earth)
        self.uptime = 0
        
    def get_status(self):
        return {
            "timestamp": datetime.now().isoformat(),
            "location": "Shackleton Crater, Moon",
            "gravity": f"{self.gravity} m/s^2",
            "internal_temp": f"{self.base_temp + random.uniform(-1, 1):.2f} C",
            "power_level": f"{self.power_level:.1f}%",
            "network_status": "NOMINAL" if self.power_level > 20 else "DEGRADED",
            "latency_to_earth": f"{self.network_latency}s"
        }

    def run_simulation(self, duration_sec=10):
        print(f"🌕 Starting Moonbase Alpha Simulation ({duration_sec}s)...")
        for i in range(duration_sec):
            status = self.get_status()
            print(f"[{i+1}/{duration_sec}] Power: {status['power_level']} | Temp: {status['internal_temp']} | Network: {status['network_status']}")
            time.sleep(1)
            self.power_level -= random.uniform(0.1, 0.5)
            
        print("✅ Simulation Complete.")

if __name__ == "__main__":
    sim = LunarSimulator()
    sim.run_simulation()

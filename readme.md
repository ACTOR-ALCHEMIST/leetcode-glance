# 🚀 LeetCode Glance for Übersicht

A sleek, modern, and customizable Übersicht widget that displays your LeetCode statistics directly on your macOS desktop. Stay motivated by keeping your progress always in sight!

![LeetCode Glance Screenshot](screenshot.png)

<p align="center">
  <img alt="Platform" src="https://img.shields.io/badge/platform-macOS-lightgrey.svg">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="Maintained" src="https://img.shields.io/badge/maintained-yes-green.svg">
</p>

## ✨ Features

* **✅ At-a-Glance Stats**: Instantly view your total problems solved, acceptance rate, and global ranking.
* **📊 Difficulty Breakdown**: See a clear breakdown of solved problems by Easy, Medium, and Hard.
* **🎨 Sleek macOS Aesthetics**: A beautiful, translucent "frosted glass" design that blends perfectly with the macOS desktop environment.
* **⚙️ Simple Configuration**: Just drop in your LeetCode username to personalize the stats.
* **🚀 Lightweight & Efficient**: Fetches data asynchronously with minimal impact on your system's performance.

## 💾 Installation

1.  **Install Übersicht**: If you don't have it, download it from [tracesof.net/uebersicht](https://tracesof.net/uebersicht/).
2.  **Open Widgets Folder**: In the Übersicht menu bar, click `Open Widgets Folder`.
3.  **Download**: [Download this repository as a ZIP file](https://github.com/your-username/leetcode-glance/archive/refs/heads/main.zip) and unzip it.
    *(Note: You will replace this link with your actual repository link later)*
4.  **Move Folder**: Move the unzipped `leetcode-glance` folder into your Übersicht `widgets` folder.

The widget should now appear on your desktop!

## 🔧 Configuration

It's easy to set it up for your profile.

1.  Open the file: `leetcode-glance/index.jsx` in a text editor.
2.  Find the following line near the top:
    ```javascript
    const LEETCODE_USERNAME = "YOUR_USERNAME_HERE";
    ```
3.  Replace `"YOUR_USERNAME_HERE"` with your LeetCode username.
4.  Save the file. The widget will update with your stats automatically.

## ❤️ Acknowledgements

This widget is powered by the fantastic, free [LeetCode Stats API](https://github.com/JeremyTsaii/leetcode-stats-api) created by JeremyTsaii.

## 📜 License

This project is open-source and available under the **MIT License**. See the [LICENSE](LICENSE) file for more info.
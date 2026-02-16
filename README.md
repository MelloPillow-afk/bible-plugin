# Bible Plugin for Figma

A Figma plugin that lets designers insert formatted biblical text directly into their designs. Search for a passage, and it gets inserted into your selected frame with proper formatting (bold, italic, verse numbers).

## Prerequisites

You'll need to install these before getting started: 

### 1. Node.js (v18 or higher)

Node.js is the runtime that builds and runs the project code.

- Go to [https://nodejs.org](https://nodejs.org) and download the **LTS** version
- Run the installer and follow the prompts
- To verify it installed, open Terminal and type: `node --version`

### 2. pnpm

pnpm is the package manager this project uses to install dependencies.

Once Node.js is installed, open Terminal and run:

```
npm install -g pnpm
```

### 3. Figma Desktop App

The plugin needs the **Figma desktop app** (not the browser version) to load locally.

- Download it from [https://www.figma.com/downloads](https://www.figma.com/downloads) if you don't already have it

## Opening Terminal

If you're not familiar with Terminal:

- **macOS:** Press `Cmd + Space` to open Spotlight, type **Terminal**, and press Enter
- **Windows:** Press `Win + R`, type **cmd**, and press Enter

All the commands below are typed into Terminal.

## Setup

### 1. Download the project

If you received the project as a zip file, unzip it and note where the folder is.

If you're cloning from GitHub:

```
git clone <repo-url>
```

### 2. Navigate into the project folder

```
cd path/to/bible-plugin
```

Replace `path/to/bible-plugin` with the actual path to the folder. You can also type `cd ` (with a space) and then drag the folder into Terminal to paste the path.

### 3. Install dependencies

```
pnpm install
```

This downloads everything the project needs. You only need to do this once (or again if dependencies change).

## Running the Plugin Locally

Start both the web app and plugin builder with a single command:

```
pnpm run dev
```

This does two things:
- Starts the web app at `http://localhost:5173`
- Watches the plugin code for changes and rebuilds automatically

Leave this running in the background while you use the plugin in Figma. To stop it, press `Ctrl + C` in Terminal.

## Adding the Plugin to Figma

You only need to do this once:

1. Open the **Figma desktop app**
2. Open any file (or create a new one)
3. Go to the menu: **Plugins** > **Development** > **Import plugin from manifest...**
4. Navigate to the project folder, then into `packages/plugin/` and select **manifest.json**
5. The plugin is now available under **Plugins** > **Development** > **Bible Plugin**

## Using the Plugin

1. Make sure `pnpm run dev` is running in Terminal
2. In Figma, select a **Frame** on your canvas (the plugin inserts content into the selected frame)
3. Go to **Plugins** > **Development** > **Bible Plugin**
4. Search for and select a passage
5. The formatted text gets inserted into your frame

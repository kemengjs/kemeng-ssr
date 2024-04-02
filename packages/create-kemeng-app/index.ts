#!/usr/bin/env node

import { createApp, createProject } from './inquirers/create'

const args = process.argv

const isApp = args.indexOf('-a') >= 0

if (isApp) {
	createApp()
} else {
	createProject()
}

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from "vscode";
import {
	TestController as AdapterTestController,
	TestAdapter,
} from "vscode-test-adapter-api";

import { TestConverter } from "./testConverter";

export class TestConverterFactory
	implements AdapterTestController, vscode.Disposable
{
	private readonly converters = new Map<TestAdapter, TestConverter>();

	/**
	 * @inheritdoc
	 */
	public registerTestAdapter(adapter: TestAdapter): void {
		this.converters.set(adapter, new TestConverter(adapter));
	}

	/**
	 * @inheritdoc
	 */
	public unregisterTestAdapter(adapter: TestAdapter): void {
		this.converters.get(adapter)?.dispose();

		this.converters.delete(adapter);
	}

	/**
	 * Gets a TestConverter by its controller ID.
	 */
	public getByControllerId(id: string) {
		for (const converter of this.converters.values()) {
			if (converter.controllerId === id) {
				return converter;
			}
		}

		return undefined;
	}

	/**
	 * @inheritdoc
	 */
	public dispose() {
		for (const disposables of this.converters.values()) {
			disposables.dispose();
		}

		vscode.commands.executeCommand(
			"setContext",
			"hasTestConverterTests",
			false,
		);
	}
}

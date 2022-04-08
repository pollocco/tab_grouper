/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadTabsFromStorage = exports.saveTabsToStorage = undefined;

let saveTabsToStorage = exports.saveTabsToStorage = (() => {
    var _ref = _asyncToGenerator(function* (tabs) {
        const storedTabs = yield (0, _idbFileStorage.getFileStorage)({ name: "tabs-grouped" });
        const file = yield storedTabs.createMutableFile("tabs_grouped.json");
        const fh = file.open("readwrite");
        yield fh.write(JSON.stringify(tabs));
        yield fh.close();

        yield file.persist();
    });

    return function saveTabsToStorage(_x) {
        return _ref.apply(this, arguments);
    };
})();

let loadTabsFromStorage = exports.loadTabsFromStorage = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        const storedTabs = yield (0, _idbFileStorage.getFileStorage)({ name: "tabs-grouped" });
        var file = yield storedTabs.get('tabs_grouped.json');
        if (file.open) {
            const fh = yield file.open("readonly");
            const metadata = yield fh.getMetadata();
            var tabs = yield fh.readAsText(metadata.size);
            tabs = JSON.parse(tabs);
            yield fh.close();
            return tabs;
        }
    });

    return function loadTabsFromStorage() {
        return _ref2.apply(this, arguments);
    };
})();

var _idbFileStorage = __webpack_require__(1);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @typedef {Object} IDBPromisedFileHandle.Metadata
 * @property {number} size
 *   The size of the file in bytes.
 * @property {Date} last Modified
 *   The time and date of the last change to the file.
 */

/**
 * @typedef {Object} IDBFileStorage.ListFilteringOptions
 * @property {string} startsWith
 *   A string to be checked with `fileNameString.startsWith(...)`.
 * @property {string} endsWith
 *   A string to be checked with  `fileNameString.endsWith(...)`.
 * @property {string} includes
 *   A string to be checked with `fileNameString.includes(...)`.
 * @property {function} filterFn
 *   A function to be used to check the file name (`filterFn(fileNameString)`).
 */

/**
 * Wraps a DOMRequest into a promise, optionally transforming the result using the onsuccess
 * callback.
 *
 * @param {IDBRequest|DOMRequest} req
 *   The DOMRequest instance to wrap in a Promise.
 * @param {function}  [onsuccess]
 *   An optional onsuccess callback which can transform the result before resolving it.
 *
 * @returns {Promise}
 *   The promise which wraps the request result, rejected if the request.onerror has been
 *   called.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Retrieve an IDBFileStorage instance by name (and it creates the indexedDB if it doesn't
 * exist yet).
 *
 * @param {Object} [param]
 * @param {string} [param.name="default"]
 *   The name associated to the IDB File Storage.
 * @param {boolean} [param.persistent]
 *   Optionally enable persistent storage mode (not enabled by default).
 *
 * @returns {IDBFileStorage}
 *   The IDBFileStorage instance with the given name.
 */
let getFileStorage = exports.getFileStorage = (() => {
  var _ref3 = _asyncToGenerator(function* ({ name, persistent } = {}) {
    const filesStorage = new IDBFileStorage({ name: name || "default", persistent });
    yield filesStorage.initializedDB();
    return filesStorage;
  });

  return function getFileStorage() {
    return _ref3.apply(this, arguments);
  };
})();

/**
 * @external {Blob} https://developer.mozilla.org/en-US/docs/Web/API/Blob
 */

/**
 * @external {DOMRequest} https://developer.mozilla.org/en/docs/Web/API/DOMRequest
 */

/**
 * @external {File} https://developer.mozilla.org/en-US/docs/Web/API/File
 */

/**
 * @external {IDBMutableFile} https://developer.mozilla.org/en-US/docs/Web/API/IDBMutableFile
 */

/**
 * @external {IDBRequest} https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest
 */


exports.waitForDOMRequest = waitForDOMRequest;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function waitForDOMRequest(req, onsuccess) {
  return new Promise((resolve, reject) => {
    req.onsuccess = onsuccess ? () => resolve(onsuccess(req.result)) : () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Wraps an IDBMutableFile's FileHandle with a nicer Promise-based API.
 *
 * Instances of this class are created from the
 * {@link IDBPromisedMutableFile.open} method.
 */
class IDBPromisedFileHandle {
  /**
   * @private private helper method used internally.
   */
  constructor({ file, lockedFile }) {
    // All the following properties are private and it should not be needed
    // while using the API.

    /** @private */
    this.file = file;
    /** @private */
    this.lockedFile = lockedFile;
    /** @private */
    this.writeQueue = Promise.resolve();
    /** @private */
    this.closed = undefined;
    /** @private */
    this.aborted = undefined;
  }

  /**
   * @private private helper method used internally.
   */
  ensureLocked({ invalidMode } = {}) {
    if (this.closed) {
      throw new Error("FileHandle has been closed");
    }

    if (this.aborted) {
      throw new Error("FileHandle has been aborted");
    }

    if (!this.lockedFile) {
      throw new Error("Invalid FileHandled");
    }

    if (invalidMode && this.lockedFile.mode === invalidMode) {
      throw new Error(`FileHandle should not be opened as '${this.lockedFile.mode}'`);
    }
    if (!this.lockedFile.active) {
      // Automatically relock the file with the last open mode
      this.file.reopenFileHandle(this);
    }
  }

  // Promise-based MutableFile API

  /**
   * Provide access to the mode that has been used to open the {@link IDBPromisedMutableFile}.
   *
   * @type {"readonly"|"readwrite"|"writeonly"}
   */
  get mode() {
    return this.lockedFile.mode;
  }

  /**
   * A boolean property that is true if the lock is still active.
   *
   * @type {boolean}
   */
  get active() {
    return this.lockedFile ? this.lockedFile.active : false;
  }

  /**
   * Close the locked file (and wait for any written data to be flushed if needed).
   *
   * @returns {Promise}
   *   A promise which is resolved when the close request has been completed
   */
  close() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.lockedFile) {
        throw new Error("FileHandle is not open");
      }

      // Wait the queued write to complete.
      yield _this.writeQueue;

      // Wait for flush request to complete if needed.
      if (_this.lockedFile.active && _this.lockedFile.mode !== "readonly") {
        yield waitForDOMRequest(_this.lockedFile.flush());
      }

      _this.closed = true;
      _this.lockedFile = null;
      _this.writeQueue = Promise.resolve();
    })();
  }

  /**
   * Abort any pending data request and set the instance as aborted.
   *
   * @returns {Promise}
   *   A promise which is resolved when the abort request has been completed
   */
  abort() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (_this2.lockedFile.active) {
        // NOTE: in the docs abort is reported to return a DOMRequest, but it doesn't seem
        // to be the case. (https://developer.mozilla.org/en-US/docs/Web/API/LockedFile/abort)
        _this2.lockedFile.abort();
      }

      _this2.aborted = true;
      _this2.lockedFile = null;
      _this2.writeQueue = Promise.resolve();
    })();
  }

  /**
   * Get the file metadata (take a look to {@link IDBPromisedFileHandle.Metadata} for more info).
   *
   * @returns {Promise<{size: number, lastModified: Date}>}
   *   A promise which is resolved when the request has been completed
   */
  getMetadata() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      _this3.ensureLocked();
      return waitForDOMRequest(_this3.lockedFile.getMetadata());
    })();
  }

  /**
   * Read a given amount of data from the file as Text (optionally starting from the specified
   * location).
   *
   * @param {number} size
   *   The amount of data to read.
   * @param {number} [location]
   *   The location where the request should start to read the data.
   *
   * @returns {Promise<string>}
   *   A promise which resolves to the data read, when the request has been completed.
   */
  readAsText(size, location) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      _this4.ensureLocked({ invalidMode: "writeonly" });
      if (typeof location === "number") {
        _this4.lockedFile.location = location;
      }
      return waitForDOMRequest(_this4.lockedFile.readAsText(size));
    })();
  }

  /**
   * Read a given amount of data from the file as an ArrayBufer (optionally starting from the specified
   * location).
   *
   * @param {number} size
   *   The amount of data to read.
   * @param {number} [location]
   *   The location where the request should start to read the data.
   *
   * @returns {Promise<ArrayBuffer>}
   *   A promise which resolves to the data read, when the request has been completed.
   */
  readAsArrayBuffer(size, location) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      _this5.ensureLocked({ invalidMode: "writeonly" });
      if (typeof location === "number") {
        _this5.lockedFile.location = location;
      }
      return waitForDOMRequest(_this5.lockedFile.readAsArrayBuffer(size));
    })();
  }

  /**
   * Truncate the file (optionally at a specified location).
   *
   * @param {number} [location=0]
   *   The location where the file should be truncated.
   *
   * @returns {Promise<ArrayBuffer>}
   *   A promise which is resolved once the request has been completed.
   */
  truncate(location = 0) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      _this6.ensureLocked({ invalidMode: "readonly" });
      return waitForDOMRequest(_this6.lockedFile.truncate(location));
    })();
  }

  /**
   * Append the passed data to the end of the file.
   *
   * @param {string|ArrayBuffer} data
   *   The data to append to the end of the file.
   *
   * @returns {Promise}
   *   A promise which is resolved once the request has been completed.
   */
  append(data) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      _this7.ensureLocked({ invalidMode: "readonly" });
      return waitForDOMRequest(_this7.lockedFile.append(data));
    })();
  }

  /**
   * Write data into the file (optionally starting from a defined location in the file).
   *
   * @param {string|ArrayBuffer} data
   *   The data to write into the file.
   * @param {number} location
   *   The location where the data should be written.
   *
   * @returns {Promise<number>}
   *   A promise which is resolved to the location where the written data ends.
   */
  write(data, location) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      _this8.ensureLocked({ invalidMode: "readonly" });
      if (typeof location === "number") {
        _this8.lockedFile.location = location;
      }
      return waitForDOMRequest(_this8.lockedFile.write(data),
      // Resolves to the new location.
      function () {
        return _this8.lockedFile.location;
      });
    })();
  }

  /**
   * Queue data to be written into the file (optionally starting from a defined location in the file).
   *
   * @param {string|ArrayBuffer} data
   *   The data to write into the file.
   * @param {number} location
   *   The location where the data should be written (when not specified the end of the previous
   *   queued write is used).
   *
   * @returns {Promise<number>}
   *   A promise which is resolved once the request has been completed with the location where the
   *   file was after the data has been writted.
   */
  queuedWrite(data, location) {
    var _this9 = this;

    const nextWriteRequest = (() => {
      var _ref = _asyncToGenerator(function* (lastLocation) {
        _this9.ensureLocked({ invalidMode: "readonly" });

        if (typeof location === "number") {
          return _this9.write(data, location);
        }
        return _this9.write(data, lastLocation);
      });

      return function nextWriteRequest(_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.writeQueue = this.writeQueue.then(nextWriteRequest);
    return this.writeQueue;
  }

  /**
   * Wait that any queued data has been written.
   *
   * @returns {Promise<number>}
   *   A promise which is resolved once the request has been completed with the location where the
   *   file was after the data has been writted.
   */
  waitForQueuedWrites() {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      yield _this10.writeQueue;
    })();
  }
}

exports.IDBPromisedFileHandle = IDBPromisedFileHandle; /**
                                                        * Wraps an IDBMutableFile with a nicer Promise-based API.
                                                        *
                                                        * Instances of this class are created from the
                                                        * {@link IDBFileStorage.createMutableFile} method.
                                                        */

class IDBPromisedMutableFile {
  /**
   * @private private helper method used internally.
   */
  constructor({ filesStorage, idb, fileName, fileType, mutableFile }) {
    // All the following properties are private and it should not be needed
    // while using the API.

    /** @private */
    this.filesStorage = filesStorage;
    /** @private */
    this.idb = idb;
    /** @private */
    this.fileName = fileName;
    /** @private */
    this.fileType = fileType;
    /** @private */
    this.mutableFile = mutableFile;
  }

  /**
   * @private private helper method used internally.
   */
  reopenFileHandle(fileHandle) {
    fileHandle.lockedFile = this.mutableFile.open(fileHandle.mode);
  }

  // API methods.

  /**
   * Open a mutable file for reading/writing data.
   *
   * @param {"readonly"|"readwrite"|"writeonly"} mode
   *   The mode of the created IDBPromisedFileHandle instance.
   *
   * @returns {IDBPromisedFileHandle}
   *   The created IDBPromisedFileHandle instance.
   */
  open(mode) {
    if (this.lockedFile) {
      throw new Error("MutableFile cannot be opened twice");
    }
    const lockedFile = this.mutableFile.open(mode);

    return new IDBPromisedFileHandle({ file: this, lockedFile });
  }

  /**
   * Get a {@link File} instance of this mutable file.
   *
   * @returns {Promise<File>}
   *   A promise resolved to the File instance.
   *
   * To read the actual content of the mutable file as a File object,
   * it is often better to use {@link IDBPromisedMutableFile.saveAsFileSnapshot}
   * to save a persistent snapshot of the file in the IndexedDB store,
   * or reading it directly using the {@link IDBPromisedFileHandle} instance
   * returned by the {@link IDBPromisedMutableFile.open} method.
   *
   * The reason is that to be able to read the content of the returned file
   * a lockfile have be keep the file open, e.d. as in the following example.
   *
   * @example
   *     ...
   *     let waitSnapshotStored;
   *     await mutableFile.runFileRequestGenerator(function* (lockedFile) {
   *       const file = yield lockedFile.mutableFile.getFile();
   *       // read the file content or turn it into a persistent object of its own
   *       // (e.g. by saving it back into IndexedDB as its snapshot in form of a File object,
   *       // or converted into a data url, a string or an array buffer)
   *
   *       waitSnapshotStored = tmpFiles.put("${filename}/last_snapshot", file);
   *     }
   *
   *     await waitSnapshotStored;
   *     let fileSnapshot = await tmpFiles.get("${filename}/last_snapshot");
   *     ...
   *     // now you can use fileSnapshot even if the mutableFile lock is not active anymore.
   */
  getFile() {
    return waitForDOMRequest(this.mutableFile.getFile());
  }

  /**
   * Persist the content of the mutable file into the files storage
   * as a File, using the specified snapshot name and return the persisted File instance.
   *
   * @returns {Promise<File>}
   *   A promise resolved to the File instance.
   *
   * @example
   *
   *      const file = await mutableFile.persistAsFileSnapshot(`${filename}/last_snapshot`);
   *      const blobURL = URL.createObjectURL(file);
   *      ...
   *      // The blob URL is still valid even if the mutableFile is not active anymore.
   */
  persistAsFileSnapshot(snapshotName) {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      if (snapshotName === _this11.fileName) {
        throw new Error("Snapshot name and the file name should be different");
      }

      const idb = yield _this11.filesStorage.initializedDB();
      yield _this11.runFileRequestGenerator(function* () {
        const file = yield this.mutableFile.getFile();
        const objectStore = this.filesStorage.getObjectStoreTransaction({ idb, mode: "readwrite" });

        yield objectStore.put(file, snapshotName);
      }.bind(_this11));

      return _this11.filesStorage.get(snapshotName);
    })();
  }

  /**
   * Persist the this mutable file into its related IDBFileStorage.
   *
   * @returns {Promise}
   *   A promise resolved on the mutable file has been persisted into IndexedDB.
   */
  persist() {
    return this.filesStorage.put(this.fileName, this);
  }

  /**
   * Run a generator function which can run a sequence of FileRequests
   * without the lockfile to become inactive.
   *
   * This method should be rarely needed, mostly to optimize a sequence of
   * file operations without the file to be closed and automatically re-opened
   * between two file requests.
   *
   * @param {function* (lockedFile) {...}} generatorFunction
   * @param {"readonly"|"readwrite"|"writeonly"} mode
   *
   * @example
   *   (async function () {
   *      const tmpFiles = await IDBFiles.getFileStorage({name: "tmpFiles"});
   *      const mutableFile = await tmpFiles.createMutableFile("test-mutable-file.txt");
   *
   *      let allFileData;
   *
   *      function* fileOperations(lockedFile) {
   *        yield lockedFile.write("some data");
   *        yield lockedFile.write("more data");
   *        const metadata = yield lockedFile.getMetadata();
   *
   *        lockedFile.location = 0;
   *        allFileData = yield lockedFile.readAsText(metadata.size);
   *      }
   *
   *      await mutableFile.runFileRequestGenerator(fileOperations, "readwrite");
   *
   *      console.log("File Data", allFileData);
   *   })();
   */
  runFileRequestGenerator(generatorFunction, mode) {
    var _this12 = this;

    return _asyncToGenerator(function* () {
      if (generatorFunction.constructor.name !== "GeneratorFunction") {
        throw new Error("runGenerator parameter should be a generator function");
      }

      yield new Promise(function (resolve, reject) {
        const lockedFile = _this12.mutableFile.open(mode || "readwrite");
        const fileRequestsIter = generatorFunction(lockedFile);

        const processFileRequestIter = function (prevRequestResult) {
          const nextFileRequest = fileRequestsIter.next(prevRequestResult);
          if (nextFileRequest.done) {
            resolve();
            return;
          } else if (!(nextFileRequest.value instanceof window.DOMRequest || nextFileRequest.value instanceof window.IDBRequest)) {
            const error = new Error("FileRequestGenerator should only yield DOMRequest instances");
            fileRequestsIter.throw(error);
            reject(error);
            return;
          }

          const request = nextFileRequest.value;
          if (request.onsuccess || request.onerror) {
            const error = new Error("DOMRequest onsuccess/onerror callbacks are already set");
            fileRequestsIter.throw(error);
            reject(error);
          } else {
            request.onsuccess = function () {
              return processFileRequestIter(request.result);
            };
            request.onerror = function () {
              return reject(request.error);
            };
          }
        };

        processFileRequestIter();
      });
    })();
  }
}

exports.IDBPromisedMutableFile = IDBPromisedMutableFile; /**
                                                          * Provides a Promise-based API to store files into an IndexedDB.
                                                          *
                                                          * Instances of this class are created using the exported
                                                          * {@link getFileStorage} function.
                                                          */

class IDBFileStorage {
  /**
   * @private private helper method used internally.
   */
  constructor({ name, persistent } = {}) {
    // All the following properties are private and it should not be needed
    // while using the API.

    /** @private */
    this.name = name;
    /** @private */
    this.persistent = persistent;
    /** @private */
    this.indexedDBName = `IDBFilesStorage-DB-${this.name}`;
    /** @private */
    this.objectStorageName = "IDBFilesObjectStorage";
    /** @private */
    this.initializedPromise = undefined;

    // TODO: evalutate schema migration between library versions?
    /** @private */
    this.version = 1.0;
  }

  /**
   * @private private helper method used internally.
   */
  initializedDB() {
    var _this13 = this;

    if (this.initializedPromise) {
      return this.initializedPromise;
    }

    this.initializedPromise = _asyncToGenerator(function* () {
      if (window.IDBMutableFile && _this13.persistent) {
        _this13.version = { version: _this13.version, storage: "persistent" };
      }
      const dbReq = indexedDB.open(_this13.indexedDBName, _this13.version);

      dbReq.onupgradeneeded = function () {
        const db = dbReq.result;
        if (!db.objectStoreNames.contains(_this13.objectStorageName)) {
          db.createObjectStore(_this13.objectStorageName);
        }
      };

      return waitForDOMRequest(dbReq);
    })();

    return this.initializedPromise;
  }

  /**
   * @private private helper method used internally.
   */
  getObjectStoreTransaction({ idb, mode } = {}) {
    const transaction = idb.transaction([this.objectStorageName], mode);
    return transaction.objectStore(this.objectStorageName);
  }

  /**
   * Create a new IDBPromisedMutableFile instance (where the IDBMutableFile is supported)
   *
   * @param {string} fileName
   *   The fileName associated to the new IDBPromisedMutableFile instance.
   * @param {string} [fileType="text"]
   *   The mime type associated to the file.
   *
   * @returns {IDBPromisedMutableFile}
   *   The newly created {@link IDBPromisedMutableFile} instance.
   */
  createMutableFile(fileName, fileType = "text") {
    var _this14 = this;

    return _asyncToGenerator(function* () {
      if (!window.IDBMutableFile) {
        throw new Error("This environment does not support IDBMutableFile");
      }
      const idb = yield _this14.initializedDB();
      const mutableFile = yield waitForDOMRequest(idb.createMutableFile(fileName, fileType));
      return new IDBPromisedMutableFile({
        filesStorage: _this14, idb, fileName, fileType, mutableFile
      });
    })();
  }

  /**
   * Put a file object into the IDBFileStorage, it overwrites an existent file saved with the
   * fileName if any.
   *
   * @param {string} fileName
   *   The key associated to the file in the IDBFileStorage.
   * @param {Blob|File|IDBPromisedMutableFile|IDBMutableFile} file
   *   The file to be persisted.
   *
   * @returns {Promise}
   *   A promise resolved when the request has been completed.
   */
  put(fileName, file) {
    var _this15 = this;

    return _asyncToGenerator(function* () {
      if (!fileName || typeof fileName !== "string") {
        throw new Error("fileName parameter is mandatory");
      }

      if (!(file instanceof File) && !(file instanceof Blob) && !(window.IDBMutableFile && file instanceof window.IDBMutableFile) && !(file instanceof IDBPromisedMutableFile)) {
        throw new Error(`Unable to persist ${fileName}. Unknown file type.`);
      }

      if (file instanceof IDBPromisedMutableFile) {
        file = file.mutableFile;
      }

      const idb = yield _this15.initializedDB();
      const objectStore = _this15.getObjectStoreTransaction({ idb, mode: "readwrite" });
      return waitForDOMRequest(objectStore.put(file, fileName));
    })();
  }

  /**
   * Remove a file object from the IDBFileStorage.
   *
   * @param {string} fileName
   *   The fileName (the associated IndexedDB key) to remove from the IDBFileStorage.
   *
   * @returns {Promise}
   *   A promise resolved when the request has been completed.
   */
  remove(fileName) {
    var _this16 = this;

    return _asyncToGenerator(function* () {
      if (!fileName) {
        throw new Error("fileName parameter is mandatory");
      }

      const idb = yield _this16.initializedDB();
      const objectStore = _this16.getObjectStoreTransaction({ idb, mode: "readwrite" });
      return waitForDOMRequest(objectStore.delete(fileName));
    })();
  }

  /**
   * List the names of the files stored in the IDBFileStorage.
   *
   * (If any filtering options has been specified, only the file names that match
   * all the filters are included in the result).
   *
   * @param {IDBFileStorage.ListFilteringOptions} options
   *   The optional filters to apply while listing the stored file names.
   *
   * @returns {Promise<string[]>}
   *   A promise resolved to the array of the filenames that has been found.
   */
  list(options) {
    var _this17 = this;

    return _asyncToGenerator(function* () {
      const idb = yield _this17.initializedDB();
      const objectStore = _this17.getObjectStoreTransaction({ idb });
      const allKeys = yield waitForDOMRequest(objectStore.getAllKeys());

      let filteredKeys = allKeys;

      if (options) {
        filteredKeys = filteredKeys.filter(function (key) {
          let match = true;

          if (typeof options.startsWith === "string") {
            match = match && key.startsWith(options.startsWith);
          }

          if (typeof options.endsWith === "string") {
            match = match && key.endsWith(options.endsWith);
          }

          if (typeof options.includes === "string") {
            match = match && key.includes(options.includes);
          }

          if (typeof options.filterFn === "function") {
            match = match && options.filterFn(key);
          }

          return match;
        });
      }

      return filteredKeys;
    })();
  }

  /**
   * Count the number of files stored in the IDBFileStorage.
   *
   * (If any filtering options has been specified, only the file names that match
   * all the filters are included in the final count).
   *
   * @param {IDBFileStorage.ListFilteringOptions} options
   *   The optional filters to apply while listing the stored file names.
   *
   * @returns {Promise<number>}
   *   A promise resolved to the number of files that has been found.
   */
  count(options) {
    var _this18 = this;

    return _asyncToGenerator(function* () {
      if (!options) {
        const idb = yield _this18.initializedDB();
        const objectStore = _this18.getObjectStoreTransaction({ idb });
        return waitForDOMRequest(objectStore.count());
      }

      const filteredKeys = yield _this18.list(options);
      return filteredKeys.length;
    })();
  }

  /**
   * Retrieve a file stored in the IDBFileStorage by key.
   *
   * @param {string} fileName
   *   The key to use to retrieve the file from the IDBFileStorage.
   *
   * @returns {Promise<Blob|File|IDBPromisedMutableFile>}
   *   A promise resolved once the file stored in the IDBFileStorage has been retrieved.
   */
  get(fileName) {
    var _this19 = this;

    return _asyncToGenerator(function* () {
      const idb = yield _this19.initializedDB();
      const objectStore = _this19.getObjectStoreTransaction({ idb });
      return waitForDOMRequest(objectStore.get(fileName)).then(function (result) {
        if (window.IDBMutableFile && result instanceof window.IDBMutableFile) {
          return new IDBPromisedMutableFile({
            filesStorage: _this19,
            idb,
            fileName,
            fileType: result.type,
            mutableFile: result
          });
        }

        return result;
      });
    })();
  }

  /**
   * Remove all the file objects stored in the IDBFileStorage.
   *
   * @returns {Promise}
   *   A promise resolved once the IDBFileStorage has been cleared.
   */
  clear() {
    var _this20 = this;

    return _asyncToGenerator(function* () {
      const idb = yield _this20.initializedDB();
      const objectStore = _this20.getObjectStoreTransaction({ idb, mode: "readwrite" });
      return waitForDOMRequest(objectStore.clear());
    })();
  }
}exports.IDBFileStorage = IDBFileStorage;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
let listenForClicks = (() => {
  var _ref = _asyncToGenerator(function* () {
    let handleClick = (() => {
      var _ref2 = _asyncToGenerator(function* (e) {
        function reportError(error) {
          console.error(`Error: ${error}`);
        }

        // Check classes of clicked element to determine
        // next action:

        let elClasses = e.target.classList;
        let eTmp = e.target;
        if (elClasses.contains("close")) {
          removeTabItem(eTmp.parentElement, reportError);

          yield removeFromTabGroup(eTmp.parentElement.id.slice(10));
        } else if (elClasses.contains("tab")) {
          showTab(eTmp);
        } else if (elClasses.contains("reset")) {
          browser.tabs.query({ active: true, currentWindow: true }).then(reset).catch(reportError);
        }
      });

      return function handleClick(_x) {
        return _ref2.apply(this, arguments);
      };
    })();

    let removeFromTabGroup = (() => {
      var _ref3 = _asyncToGenerator(function* (tabId) {
        let tabIdToRemove = parseInt(tabId);
        console.log(tabIdToRemove);
        for (let i = tabGroup.length - 1; i >= 0; i--) {
          if (tabGroup[i].id == tabIdToRemove) {
            console.log(tabGroup);
            tabGroup.splice(i, 1);
            console.log(tabGroup);
            break;
          }
        }
        yield (0, _storage.saveTabsToStorage)(tabGroup);
      });

      return function removeFromTabGroup(_x2) {
        return _ref3.apply(this, arguments);
      };
    })();

    let getTabById = (() => {
      var _ref4 = _asyncToGenerator(function* (id) {
        for (tab of tabGroup) {
          if (tab.id == id) {
            return tab;
          }
        }
      });

      return function getTabById(_x3) {
        return _ref4.apply(this, arguments);
      };
    })();

    var tabGroup = yield (0, _storage.loadTabsFromStorage)();
    for (let tab of tabGroup) {
      let tabItem = document.createElement("div");

      let faviconDiv = document.createElement("div");

      let faviconImg = document.createElement("img");
      faviconImg.className = "tab_favicon";
      faviconImg.src = tab.favIconUrl;

      faviconDiv.appendChild(faviconImg);

      tabItem.id = tab.id;
      tabItem.className = "button tab";
      tabItem.textContent += tab.title;

      tabItem.appendChild(faviconDiv);

      let tabItemContainer = document.createElement("div");
      tabItemContainer.className = "item_container";

      tabItemContainer.appendChild(tabItem);
      tabItemContainer.id = `container-${tab.id}`;

      let tabCloseButton = document.createElement("button");
      tabCloseButton.className = "close";
      tabCloseButton.textContent = "X";

      tabItemContainer.appendChild(tabCloseButton);

      document.getElementById("popup-content").appendChild(tabItemContainer);
    }

    function onMoved(tab) {
      console.log("Moved " + tab.id);
    }

    document.addEventListener("click", handleClick);

    function removeTabItem(tabContainer, reportError) {
      document.getElementById("popup-content").removeChild(document.getElementById(tabContainer.id));
    }

    function showTab(tab) {
      let tabId = parseInt(tab.id);
      browser.tabs.show(tabId).then(() => {
        browser.tabs.update(tabId, {
          active: true
        }).then(() => {
          let moving = browser.tabs.move(tabId, { index: -1 });
          moving.then(onMoved, reportError);
        });
      });
    }
  });

  return function listenForClicks() {
    return _ref.apply(this, arguments);
  };
})();

var _storage = __webpack_require__(0);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

listenForClicks();

/***/ })
/******/ ]);
//# sourceMappingURL=tab_group_popup.js.map
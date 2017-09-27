import config from "./config";
import models from "./models"
import {EventEmitter} from 'events';

console.log(config.name);
new models.User();
new models.Product();

const emitter = new EventEmitter();

const watcher = new models.DirWatcher(emitter);
watcher.watch(config.data_dir, 10000);

new models.Importer(emitter);
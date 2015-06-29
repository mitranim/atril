import {bootstrap, viewCache} from 'atril';

import views from 'views';
for (let path in views) viewCache.set(path, views[path]);

import 'config';
import 'attributes/all';
import 'molds/all';
import 'hello-world/hello-world';
// import 'inner-component/inner-component';
// import 'mock-component/mock-component';
import 'todo-item/todo-item';
import 'todo-list/todo-list';

bootstrap();

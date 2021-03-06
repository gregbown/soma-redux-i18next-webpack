declare module infuse {

  var version: string;
  export function getDependencies(cl: any);

  export class Injector {
    createChild():Injector;
    getMappingVo(prop: string):any;
    mapValue(prop: string, val: any):Injector;
    mapClass(prop: string, cl: any, singleton?: boolean):Injector;
    removeMapping(prop: string):Injector;
    hasMapping(prop: string):boolean;
    hasInheritedMapping(prop: string):boolean;
    getMapping(value: any):string;
    getValue(prop:string):any;
    getClass(prop:string):any;
    instantiate(TargetClass: any, ...args: any[]):any;
    inject(target: any, isParent: boolean):Injector;
    getInjectedValue(vo: any, name:string):any;
    createInstance(...args: any[]):any;
    getValueFromClass(cl: any):any;
    dispose():void;
  }
}

declare module soma {

  var version: string;

  export class Modules {
    create(module: any, args: any, register: boolean, useChildInjector: boolean):any;
    has(id: string):any;
    get(id: string):any;
    remove(id: string):void;
    dispose():void;
  }

  export class Emitter {
    addListener(id: string, handler: any, scope: any, priority?: boolean):void;
    addListenerOnce(id: string, handler: any, scope: any, priority?: boolean):void;
    removeListener(id: string, handler: any, scope: any):void;
    getSignal(id: string):any;
    extend(object: any):any;
    dispatch(id: string, args?: any):any;
    dispose():void;
  }
}

declare module soma {

  module plugins {
    export function add(plugin: any);
    export function remove(plugin: any);
  }

  var version: string;
  export function applyProperties(target: any, extension: any, bindToExtension: boolean, list?: any[]);
  export function augment(target: any, extension: any, list?: any[]);
  export function inherit(target: any, parent: any);
  export function extend(obj: any);

  export class Application {
    injector: infuse.Injector;
    emitter: soma.Emitter;
    commands: soma.Commands;
    mediators: soma.Mediators;
    modules: soma.Modules;
    init():void;
    setup():void;
    dispose():void;
    extend(object: any):any;
  }
  export class Commands {
    has(commandName: string):boolean;
    get(commandName: string):any;
    getAll():any;
    add(commandName: string, command: any):void;
    remove(commandName: string):void;
    dispose():void;
    addInterceptor(scope: any, id: string, command: any): any;
    removeInterceptor(scope: any, id: string): void;
  }
  export class Mediators {
    create(cl:any, target:any):any;
    dispose():void;
  }
}

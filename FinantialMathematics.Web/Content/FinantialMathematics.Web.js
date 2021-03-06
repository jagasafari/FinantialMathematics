// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2015 IntelliFactory
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You may
// obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.
//
// $end{copyright}

try {
    Object.defineProperty(Error.prototype, 'message', { enumerable: true });
} catch (e) { }

var IntelliFactory =
{
    Runtime:
    {
        Class:
            function (p, s) {
                function r() { }
                r.prototype = p;
                for (var f in s) { r[f] = s[f]; }
                return r;
            },

        Define:
            function (a, b) {
                var overwrite = !!this.overwrite;
                function define(a, b) {
                    for (var k in b) {
                        var t1 = typeof a[k];
                        var t2 = typeof b[k];
                        if (t1 == "object" && t2 == "object") {
                            define(a[k], b[k]);
                        } else if (t1 == "undefined" || overwrite) {
                            a[k] = b[k];
                        } else {
                            throw new Error("Name conflict: " + k);
                        }
                    }
                }
                define(a, b);
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === undefined) { delete obj[f]; }
                }
                return obj;
            },

        Field:
            function (f) {
                var value, ready = false;
                return function () {
                    if (!ready) { ready = true; value = f(); }
                    return value;
                }
            },

        GetOptional:
            function (value) {
                return (value === undefined) ? { $: 0 } : { $: 1, $0: value };
            },

        New:		
            function (ctor, fields) {
                var r = new ctor();
                for (var f in fields) {
                    if (!(f in r)) {
                        r[f] = fields[f];
                    }
                }
                return r
            },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        OnInit:
            function (f) {
                if (!("init" in this)) {
                    this.init = [];
                }
                this.init.push(f);
            },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Inherit:
            function (a, b) {
		if (typeof b !== "function") return;
                var p = a.prototype;
                a.prototype = new b();
                for (var f in p) {
                    a.prototype[f] = p[f];
                }
            },

        Safe:
            function (x) {
                if (x === undefined) return {};
                return x;
            },

        SetOptional:
            function (obj, field, value) {
                if (value.$ == 0) {
                    delete obj[field];
                } else {
                    obj[field] = value.$0;
                }
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("init" in this) {
                    run(this.init);
                    this.init = [];
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },

        Bind:
            function (f, obj) {
                return function () { return f.apply(this, arguments) }
            },

        CreateFuncWithArgs:
            function (f) {
                return function () { return f(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithOnlyThis:
            function (f) {
                return function () { return f(this); }
            },

        CreateFuncWithThis:
            function (f) {
                return function () { return f(this).apply(null, arguments); }
            },

        CreateFuncWithThisArgs:
            function (f) {
                return function () { return f(this)(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithRest:
            function (length, f) {
                return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])); }
            },

        CreateFuncWithArgsRest:
            function (length, f) {
                return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]); }
            },

        UnionByType:
            function (types, value, optional) {
                var vt = typeof value;
                for (var i = 0; i < types.length; i++) {
                    var t = types[i];
                    if (typeof t == "number") {
                        if (Array.isArray(value) && (t == 0 || value.length == t)) {
                            return { $: i, $0: value };
                        }
                    } else {
                        if (t == vt) {
                            return { $: i, $0: value };
                        }
                    }
                }
                if (!optional) {
                    throw new Error("Type not expected for creating Choice value.");
                }
            }
    }
};

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

if (!Math.trunc) {
    Math.trunc = function (x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    }
}
;
var JSON;JSON||(JSON={}),function(){"use strict";function i(n){return n<10?"0"+n:n}function f(n){return o.lastIndex=0,o.test(n)?'"'+n.replace(o,function(n){var t=s[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function r(i,e){var s,l,h,a,v=n,c,o=e[i];o&&typeof o=="object"&&typeof o.toJSON=="function"&&(o=o.toJSON(i)),typeof t=="function"&&(o=t.call(e,i,o));switch(typeof o){case"string":return f(o);case"number":return isFinite(o)?String(o):"null";case"boolean":case"null":return String(o);case"object":if(!o)return"null";if(n+=u,c=[],Object.prototype.toString.apply(o)==="[object Array]"){for(a=o.length,s=0;s<a;s+=1)c[s]=r(s,o)||"null";return h=c.length===0?"[]":n?"[\n"+n+c.join(",\n"+n)+"\n"+v+"]":"["+c.join(",")+"]",n=v,h}if(t&&typeof t=="object")for(a=t.length,s=0;s<a;s+=1)typeof t[s]=="string"&&(l=t[s],h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));else for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&(h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));return h=c.length===0?"{}":n?"{\n"+n+c.join(",\n"+n)+"\n"+v+"}":"{"+c.join(",")+"}",n=v,h}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var e=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,u,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;typeof JSON.stringify!="function"&&(JSON.stringify=function(i,f,e){var o;if(n="",u="",typeof e=="number")for(o=0;o<e;o+=1)u+=" ";else typeof e=="string"&&(u=e);if(t=f,f&&typeof f!="function"&&(typeof f!="object"||typeof f.length!="number"))throw new Error("JSON.stringify");return r("",{"":i})}),typeof JSON.parse!="function"&&(JSON.parse=function(n,t){function r(n,i){var f,e,u=n[i];if(u&&typeof u=="object")for(f in u)Object.prototype.hasOwnProperty.call(u,f)&&(e=r(u,f),e!==undefined?u[f]=e:delete u[f]);return t.call(n,i,u)}var i;if(n=String(n),e.lastIndex=0,e.test(n)&&(n=n.replace(e,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(n.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return i=eval("("+n+")"),typeof t=="function"?r({"":i},""):i;throw new SyntaxError("JSON.parse");})}();;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Array,Arrays,Operators,List,Enumerator,T,Enumerable,Seq,Seq1,Arrays1,Ref,Activator,document,jQuery,Json,JSON,JavaScript,JSModule,AggregateException,Exception,ArgumentException,Number,IndexOutOfRangeException,List1,Arrays2D,Concurrency,Option,clearTimeout,setTimeout,CancellationTokenSource,Char,Util,Lazy,OperationCanceledException,Date,console,TimeoutException,Scheduler,HtmlContentExtensions,SingleNode,InvalidOperationException,T1,MatchFailureException,Math,Strings,PrintfHelpers,Remoting,XhrProvider,AsyncProxy,AjaxRemotingProvider,window,String,RegExp;
 Runtime.Define(Global,{
  Arrays:{
   contains:function(item,arr)
   {
    var c,i,l;
    c=true;
    i=0;
    l=arr.length;
    while(c?i<l:false)
     {
      Unchecked.Equals(arr[i],item)?c=false:i=i+1;
     }
    return!c;
   },
   mapFold:function(f,zero,arr)
   {
    var r,acc,i,patternInput,b,a;
    r=Array(arr.length);
    acc=zero;
    for(i=0;i<=arr.length-1;i++){
     patternInput=(f(acc))(Arrays.get(arr,i));
     b=patternInput[1];
     a=patternInput[0];
     Arrays.set(r,i,a);
     acc=b;
    }
    return[r,acc];
   },
   mapFoldBack:function(f,arr,zero)
   {
    var r,acc,len,j,i,patternInput,b,a;
    r=Array(arr.length);
    acc=zero;
    len=arr.length;
    for(j=1;j<=len;j++){
     i=len-j;
     patternInput=(f(Arrays.get(arr,i)))(acc);
     b=patternInput[1];
     a=patternInput[0];
     Arrays.set(r,i,a);
     acc=b;
    }
    return[r,acc];
   },
   sortInPlaceByDescending:function(f,arr)
   {
    return arr.sort(function(x,y)
    {
     return-Operators.Compare(f(x),f(y));
    });
   },
   splitInto:function(count,arr)
   {
    var len,_,count1,res,minChunkSize,startIndex,i,i1;
    count<=0?Operators.FailWith("Count must be positive"):null;
    len=Arrays.length(arr);
    if(len===0)
     {
      _=[];
     }
    else
     {
      count1=Operators.Min(count,len);
      res=Array(count1);
      minChunkSize=len/count1>>0;
      startIndex=0;
      for(i=0;i<=len%count1-1;i++){
       Arrays.set(res,i,Arrays.sub(arr,startIndex,minChunkSize+1));
       startIndex=startIndex+minChunkSize+1;
      }
      for(i1=len%count1;i1<=count1-1;i1++){
       Arrays.set(res,i1,Arrays.sub(arr,startIndex,minChunkSize));
       startIndex=startIndex+minChunkSize;
      }
      _=res;
     }
    return _;
   },
   tryFindBack:function(f,arr)
   {
    var res,i;
    res={
     $:0
    };
    i=arr.length-1;
    while(i>0?res.$==0:false)
     {
      f(Arrays.get(arr,i))?res={
       $:1,
       $0:Arrays.get(arr,i)
      }:null;
      i=i-1;
     }
    return res;
   },
   tryFindIndexBack:function(f,arr)
   {
    var res,i;
    res={
     $:0
    };
    i=arr.length-1;
    while(i>0?res.$==0:false)
     {
      f(Arrays.get(arr,i))?res={
       $:1,
       $0:i
      }:null;
      i=i-1;
     }
    return res;
   }
  },
  List:{
   map3:function(f,l1,l2,l3)
   {
    var array;
    array=Arrays.map2(function(func)
    {
     return function(arg1)
     {
      return func(arg1);
     };
    },Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)),Arrays.ofSeq(l3));
    return List.ofArray(array);
   },
   skip:function(i,l)
   {
    var res,j,_,t;
    res=l;
    for(j=1;j<=i;j++){
     if(res.$==0)
      {
       _=Operators.FailWith("Input list too short.");
      }
     else
      {
       t=res.$1;
       _=res=t;
      }
    }
    return res;
   },
   skipWhile:function(predicate,list)
   {
    var rest;
    rest=list;
    while(!(rest.$==0)?predicate(List.head(rest)):false)
     {
      rest=List.tail(rest);
     }
    return rest;
   }
  },
  Seq:{
   chunkBySize:function(size,s)
   {
    var getEnumerator;
    size<=0?Operators.FailWith("Chunk size must be positive"):null;
    getEnumerator=function()
    {
     var _enum,dispose,next;
     _enum=Enumerator.Get(s);
     dispose=function()
     {
      return _enum.Dispose();
     };
     next=function(e)
     {
      var _,res,value;
      if(_enum.MoveNext())
       {
        res=[_enum.get_Current()];
        while(Arrays.length(res)<size?_enum.MoveNext():false)
         {
          value=res.push(_enum.get_Current());
         }
        e.c=res;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     };
     return T.New(null,null,next,dispose);
    };
    return Enumerable.Of(getEnumerator);
   },
   compareWith:function(f,s1,s2)
   {
    var e1,_,e2,_1,r,loop,matchValue;
    e1=Enumerator.Get(s1);
    try
    {
     e2=Enumerator.Get(s2);
     try
     {
      r=0;
      loop=true;
      while(loop?r===0:false)
       {
        matchValue=[e1.MoveNext(),e2.MoveNext()];
        matchValue[0]?matchValue[1]?r=(f(e1.get_Current()))(e2.get_Current()):r=1:matchValue[1]?r=-1:loop=false;
       }
      _1=r;
     }
     finally
     {
      e2.Dispose!=undefined?e2.Dispose():null;
     }
     _=_1;
    }
    finally
    {
     e1.Dispose!=undefined?e1.Dispose():null;
    }
    return _;
   },
   contains:function(el,s)
   {
    var e,_,r;
    e=Enumerator.Get(s);
    try
    {
     r=false;
     while(!r?e.MoveNext():false)
      {
       r=Unchecked.Equals(e.get_Current(),el);
      }
     _=r;
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   countBy:function(f,s)
   {
    var generator;
    generator=function()
    {
     var d,e,_,keys,k,h,_1,mapping,array,x;
     d={};
     e=Enumerator.Get(s);
     try
     {
      keys=[];
      while(e.MoveNext())
       {
        k=f(e.get_Current());
        h=Unchecked.Hash(k);
        if(d.hasOwnProperty(h))
         {
          _1=void(d[h]=d[h]+1);
         }
        else
         {
          keys.push(k);
          _1=void(d[h]=1);
         }
       }
      mapping=function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      };
      array=keys.slice(0);
      x=Arrays.map(mapping,array);
      _=x;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    };
    return Seq.delay(generator);
   },
   distinct:function(s)
   {
    return Seq1.distinctBy(function(x)
    {
     return x;
    },s);
   },
   distinctBy:function(f,s)
   {
    var getEnumerator;
    getEnumerator=function()
    {
     var _enum,seen,add,dispose,next;
     _enum=Enumerator.Get(s);
     seen=Array.prototype.constructor.apply(Array,[]);
     add=function(c)
     {
      var k,h,cont,_,_1,value;
      k=f(c);
      h=Unchecked.Hash(k);
      cont=seen[h];
      if(Unchecked.Equals(cont,undefined))
       {
        seen[h]=[k];
        _=true;
       }
      else
       {
        if(Arrays1.contains(k,cont))
         {
          _1=false;
         }
        else
         {
          value=cont.push(k);
          _1=true;
         }
        _=_1;
       }
      return _;
     };
     dispose=function()
     {
      return _enum.Dispose();
     };
     next=function(e)
     {
      var _,cur,has,_1;
      if(_enum.MoveNext())
       {
        cur=_enum.get_Current();
        has=add(cur);
        while(!has?_enum.MoveNext():false)
         {
          cur=_enum.get_Current();
          has=add(cur);
         }
        if(has)
         {
          e.c=cur;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      else
       {
        _=false;
       }
      return _;
     };
     return T.New(null,null,next,dispose);
    };
    return Enumerable.Of(getEnumerator);
   },
   except:function(itemsToExclude,s)
   {
    var getEnumerator;
    getEnumerator=function()
    {
     var _enum,seen,add,enumerator,_2,i,value1,dispose,next;
     _enum=Enumerator.Get(s);
     seen=Array.prototype.constructor.apply(Array,[]);
     add=function(c)
     {
      var h,cont,_,_1,value;
      h=Unchecked.Hash(c);
      cont=seen[h];
      if(Unchecked.Equals(cont,undefined))
       {
        seen[h]=[c];
        _=true;
       }
      else
       {
        if(Arrays1.contains(c,cont))
         {
          _1=false;
         }
        else
         {
          value=cont.push(c);
          _1=true;
         }
        _=_1;
       }
      return _;
     };
     enumerator=Enumerator.Get(itemsToExclude);
     try
     {
      while(enumerator.MoveNext())
       {
        i=enumerator.get_Current();
        value1=add(i);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     dispose=function()
     {
      return _enum.Dispose();
     };
     next=function(e)
     {
      var _,cur,has,_1;
      if(_enum.MoveNext())
       {
        cur=_enum.get_Current();
        has=add(cur);
        while(!has?_enum.MoveNext():false)
         {
          cur=_enum.get_Current();
          has=add(cur);
         }
        if(has)
         {
          e.c=cur;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      else
       {
        _=false;
       }
      return _;
     };
     return T.New(null,null,next,dispose);
    };
    return Enumerable.Of(getEnumerator);
   },
   groupBy:function(f,s)
   {
    return Seq.delay(function()
    {
     var d,d1,keys,e,_,c,k,h;
     d={};
     d1={};
     keys=[];
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        c=e.get_Current();
        k=f(c);
        h=Unchecked.Hash(k);
        !d.hasOwnProperty(h)?keys.push(k):null;
        d1[h]=k;
        d.hasOwnProperty(h)?d[h].push(c):void(d[h]=[c]);
       }
      _=Arrays.map(function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      },keys);
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    });
   },
   insufficient:function()
   {
    return Operators.FailWith("The input sequence has an insufficient number of elements.");
   },
   last:function(s)
   {
    var e,_,value,_1;
    e=Enumerator.Get(s);
    try
    {
     value=e.MoveNext();
     if(!value)
      {
       _1=Seq1.insufficient();
      }
     else
      {
       while(e.MoveNext())
        {
        }
       _1=e.get_Current();
      }
     _=_1;
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   nonNegative:function()
   {
    return Operators.FailWith("The input must be non-negative.");
   },
   pairwise:function(s)
   {
    var mapping,source;
    mapping=function(x)
    {
     return[Arrays.get(x,0),Arrays.get(x,1)];
    };
    source=Seq1.windowed(2,s);
    return Seq.map(mapping,source);
   },
   truncate:function(n,s)
   {
    return Seq.delay(function()
    {
     return Seq.enumUsing(Enumerator.Get(s),function(e)
     {
      var i;
      i=[0];
      return Seq.enumWhile(function()
      {
       return e.MoveNext()?i[0]<n:false;
      },Seq.delay(function()
      {
       Ref.incr(i);
       return[e.get_Current()];
      }));
     });
    });
   },
   tryHead:function(s)
   {
    var e,_;
    e=Enumerator.Get(s);
    try
    {
     _=e.MoveNext()?{
      $:1,
      $0:e.get_Current()
     }:{
      $:0
     };
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   tryItem:function(i,s)
   {
    var _,j,e,_1,go;
    if(i<0)
     {
      _={
       $:0
      };
     }
    else
     {
      j=0;
      e=Enumerator.Get(s);
      try
      {
       go=true;
       while(go?j<=i:false)
        {
         e.MoveNext()?j=j+1:go=false;
        }
       _1=go?{
        $:1,
        $0:e.get_Current()
       }:{
        $:0
       };
      }
      finally
      {
       e.Dispose!=undefined?e.Dispose():null;
      }
      _=_1;
     }
    return _;
   },
   tryLast:function(s)
   {
    var e,_,_1;
    e=Enumerator.Get(s);
    try
    {
     if(e.MoveNext())
      {
       while(e.MoveNext())
        {
        }
       _1={
        $:1,
        $0:e.get_Current()
       };
      }
     else
      {
       _1={
        $:0
       };
      }
     _=_1;
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   unfold:function(f,s)
   {
    var getEnumerator;
    getEnumerator=function()
    {
     var next;
     next=function(e)
     {
      var matchValue,_,t,s1;
      matchValue=f(e.s);
      if(matchValue.$==0)
       {
        _=false;
       }
      else
       {
        t=matchValue.$0[0];
        s1=matchValue.$0[1];
        e.c=t;
        e.s=s1;
        _=true;
       }
      return _;
     };
     return T.New(s,null,next,function()
     {
     });
    };
    return Enumerable.Of(getEnumerator);
   },
   windowed:function(windowSize,s)
   {
    windowSize<=0?Operators.FailWith("The input must be positive."):null;
    return Seq.delay(function()
    {
     return Seq.enumUsing(Enumerator.Get(s),function(e)
     {
      var q;
      q=[];
      return Seq.append(Seq.enumWhile(function()
      {
       return q.length<windowSize?e.MoveNext():false;
      },Seq.delay(function()
      {
       q.push(e.get_Current());
       return Seq.empty();
      })),Seq.delay(function()
      {
       return q.length===windowSize?Seq.append([q.slice(0)],Seq.delay(function()
       {
        return Seq.enumWhile(function()
        {
         return e.MoveNext();
        },Seq.delay(function()
        {
         q.shift();
         q.push(e.get_Current());
         return[q.slice(0)];
        }));
       })):Seq.empty();
      }));
     });
    });
   }
  },
  WebSharper:{
   Activator:{
    Activate:Runtime.Field(function()
    {
     var _,meta;
     if(Activator.hasDocument())
      {
       meta=document.getElementById("websharper-data");
       _=meta?jQuery(document).ready(function()
       {
        var text,obj,action,array;
        text=meta.getAttribute("content");
        obj=Json.Activate(JSON.parse(text));
        action=function(tupledArg)
        {
         var k,v,p,old;
         k=tupledArg[0];
         v=tupledArg[1];
         p=v.get_Body();
         old=document.getElementById(k);
         return p.ReplaceInDom(old);
        };
        array=JSModule.GetFields(obj);
        return Arrays.iter(action,array);
       }):null;
      }
     else
      {
       _=null;
      }
     return _;
    }),
    hasDocument:function()
    {
     var $0=this,$this=this;
     return typeof Global.document!=="undefined";
    }
   },
   AggregateException:Runtime.Class({},{
    New:function(innerExceptions)
    {
     return Runtime.New(this,AggregateException.New1("One or more errors occurred.",innerExceptions));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   ArgumentException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,ArgumentException.New1("Value does not fall within the expected range."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Arrays:{
    average:function(arr)
    {
     return Number(Arrays.sum(arr))/Number(arr.length);
    },
    averageBy:function(f,arr)
    {
     return Number(Arrays.sumBy(f,arr))/Number(arr.length);
    },
    blit:function(arr1,start1,arr2,start2,length)
    {
     var i;
     Arrays.checkRange(arr1,start1,length);
     Arrays.checkRange(arr2,start2,length);
     for(i=0;i<=length-1;i++){
      Arrays.set(arr2,start2+i,Arrays.get(arr1,start1+i));
     }
     return;
    },
    checkBounds:function(arr,n)
    {
     return(n<0?true:n>=arr.length)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    checkBounds2D:function(arr,n1,n2)
    {
     return(((n1<0?true:n2<0)?true:n1>=arr.length)?true:n2>=(arr.length?arr[0].length:0))?Operators.Raise(IndexOutOfRangeException.New()):null;
    },
    checkLength:function(arr1,arr2)
    {
     return arr1.length!==arr2.length?Operators.FailWith("Arrays differ in length."):null;
    },
    checkRange:function(arr,start,size)
    {
     return((size<0?true:start<0)?true:arr.length<start+size)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    choose:function(f,arr)
    {
     var q,i,matchValue,_,x;
     q=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=f(Arrays.get(arr,i));
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        x=matchValue.$0;
        _=q.push(x);
       }
     }
     return q;
    },
    chunkBySize:function(size,array)
    {
     var source;
     source=Seq1.chunkBySize(size,array);
     return Seq.toArray(source);
    },
    collect:function(f,x)
    {
     return Array.prototype.concat.apply([],Arrays.map(f,x));
    },
    compareWith:function(f,a1,a2)
    {
     return Seq1.compareWith(f,a1,a2);
    },
    concat:function(xs)
    {
     return Array.prototype.concat.apply([],Arrays.ofSeq(xs));
    },
    contains:function(el,a)
    {
     return Seq1.contains(el,a);
    },
    countBy:function(f,a)
    {
     var source;
     source=Seq1.countBy(f,a);
     return Seq.toArray(source);
    },
    create:function(size,value)
    {
     var r,i;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,value);
     }
     return r;
    },
    create2D:function(rows)
    {
     var mapping,source1,x;
     mapping=function(source)
     {
      return Arrays.ofSeq(source);
     };
     source1=Seq.map(mapping,rows);
     x=Arrays.ofSeq(source1);
     x.dims=2;
     return x;
    },
    distinct:function(l)
    {
     var source;
     source=Seq1.distinct(l);
     return Seq.toArray(source);
    },
    distinctBy:function(f,a)
    {
     var source;
     source=Seq1.distinctBy(f,a);
     return Seq.toArray(source);
    },
    exactlyOne:function(ar)
    {
     return Arrays.length(ar)===1?Arrays.get(ar,0):Operators.FailWith("The input does not have precisely one element.");
    },
    except:function(itemsToExclude,a)
    {
     var source;
     source=Seq1.except(itemsToExclude,a);
     return Seq.toArray(source);
    },
    exists2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.exists2(f,arr1,arr2);
    },
    fill:function(arr,start,length,value)
    {
     var i;
     Arrays.checkRange(arr,start,length);
     for(i=start;i<=start+length-1;i++){
      Arrays.set(arr,i,value);
     }
     return;
    },
    filter:function(f,arr)
    {
     var r,i;
     r=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?r.push(Arrays.get(arr,i)):null;
     }
     return r;
    },
    find:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFind(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindBack(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findINdex:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFindIndex(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndexBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindIndexBack(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,zero,arr)
    {
     var acc,i;
     acc=zero;
     for(i=0;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    fold2:function(f,zero,arr1,arr2)
    {
     var accum,i;
     Arrays.checkLength(arr1,arr2);
     accum=zero;
     for(i=0;i<=arr1.length-1;i++){
      accum=((f(accum))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return accum;
    },
    foldBack:function(f,arr,zero)
    {
     var acc,len,i;
     acc=zero;
     len=arr.length;
     for(i=1;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    foldBack2:function(f,arr1,arr2,zero)
    {
     var len,accum,i;
     Arrays.checkLength(arr1,arr2);
     len=arr1.length;
     accum=zero;
     for(i=1;i<=len;i++){
      accum=((f(Arrays.get(arr1,len-i)))(Arrays.get(arr2,len-i)))(accum);
     }
     return accum;
    },
    forall2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.forall2(f,arr1,arr2);
    },
    get:function(arr,n)
    {
     Arrays.checkBounds(arr,n);
     return arr[n];
    },
    get2D:function(arr,n1,n2)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     return arr[n1][n2];
    },
    groupBy:function(f,a)
    {
     var mapping,source,array;
     mapping=function(tupledArg)
     {
      var k,s;
      k=tupledArg[0];
      s=tupledArg[1];
      return[k,Seq.toArray(s)];
     };
     source=Seq1.groupBy(f,a);
     array=Seq.toArray(source);
     return Arrays.map(mapping,array);
    },
    head:function(ar)
    {
     return List.head(List.ofArray(ar));
    },
    indexed:function(ar)
    {
     return Arrays.mapi(function(a)
     {
      return function(b)
      {
       return[a,b];
      };
     },ar);
    },
    init:function(size,f)
    {
     var r,i;
     size<0?Operators.FailWith("Negative size given."):null;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,f(i));
     }
     return r;
    },
    iter:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i));
     }
     return;
    },
    iter2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      (f(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    iteri:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      (f(i))(Arrays.get(arr,i));
     }
     return;
    },
    iteri2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      ((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    last:function(ar)
    {
     return Seq1.last(ar);
    },
    length:function(arr)
    {
     var matchValue;
     matchValue=arr.dims;
     return matchValue===2?arr.length*arr.length:arr.length;
    },
    map:function(f,arr)
    {
     var r,i;
     r=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(r,i,f(Arrays.get(arr,i)));
     }
     return r;
    },
    map2:function(f,arr1,arr2)
    {
     var r,i;
     Arrays.checkLength(arr1,arr2);
     r=Array(arr2.length);
     for(i=0;i<=arr2.length-1;i++){
      Arrays.set(r,i,(f(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return r;
    },
    map3:function(f,l1,l2,l3)
    {
     var list;
     list=List1.map3(f,List.ofArray(l1),List.ofArray(l2),List.ofArray(l3));
     return Arrays.ofSeq(list);
    },
    mapi:function(f,arr)
    {
     var y,i;
     y=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(y,i,(f(i))(Arrays.get(arr,i)));
     }
     return y;
    },
    mapi2:function(f,arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return res;
    },
    max:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },x);
    },
    maxBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },arr);
    },
    min:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },x);
    },
    minBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },arr);
    },
    nonEmpty:function(arr)
    {
     return arr.length===0?Operators.FailWith("The input array was empty."):null;
    },
    ofSeq:function(xs)
    {
     var q,_enum,_;
     q=[];
     _enum=Enumerator.Get(xs);
     try
     {
      while(_enum.MoveNext())
       {
        q.push(_enum.get_Current());
       }
      _=q;
     }
     finally
     {
      _enum.Dispose!=undefined?_enum.Dispose():null;
     }
     return _;
    },
    pairwise:function(a)
    {
     var source;
     source=Seq1.pairwise(a);
     return Seq.toArray(source);
    },
    partition:function(f,arr)
    {
     var ret1,ret2,i;
     ret1=[];
     ret2=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?ret1.push(Arrays.get(arr,i)):ret2.push(Arrays.get(arr,i));
     }
     return[ret1,ret2];
    },
    permute:function(f,arr)
    {
     var ret,i;
     ret=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,f(i),Arrays.get(arr,i));
     }
     return ret;
    },
    pick:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryPick(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    reduce:function(f,arr)
    {
     var acc,i;
     Arrays.nonEmpty(arr);
     acc=Arrays.get(arr,0);
     for(i=1;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    reduceBack:function(f,arr)
    {
     var len,acc,i;
     Arrays.nonEmpty(arr);
     len=arr.length;
     acc=Arrays.get(arr,len-1);
     for(i=2;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    replicate:function(size,value)
    {
     return Arrays.create(size,value);
    },
    reverse:function(array,offset,length)
    {
     var a;
     a=Arrays.sub(array,offset,length).slice().reverse();
     return Arrays.blit(a,0,array,offset,Arrays.length(a));
    },
    scan:function(f,zero,arr)
    {
     var ret,i;
     ret=Array(1+arr.length);
     Arrays.set(ret,0,zero);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,i+1,(f(Arrays.get(ret,i)))(Arrays.get(arr,i)));
     }
     return ret;
    },
    scanBack:function(f,arr,zero)
    {
     var len,ret,i;
     len=arr.length;
     ret=Array(1+len);
     Arrays.set(ret,len,zero);
     for(i=0;i<=len-1;i++){
      Arrays.set(ret,len-i-1,(f(Arrays.get(arr,len-i-1)))(Arrays.get(ret,len-i)));
     }
     return ret;
    },
    set:function(arr,n,x)
    {
     Arrays.checkBounds(arr,n);
     arr[n]=x;
     return;
    },
    set2D:function(arr,n1,n2,x)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     arr[n1][n2]=x;
     return;
    },
    setSub:function(arr,start,len,src)
    {
     var i;
     for(i=0;i<=len-1;i++){
      Arrays.set(arr,start+i,Arrays.get(src,i));
     }
     return;
    },
    setSub2D:function(dst,src1,src2,len1,len2,src)
    {
     var i,j;
     for(i=0;i<=len1-1;i++){
      for(j=0;j<=len2-1;j++){
       Arrays.set2D(dst,src1+i,src2+j,Arrays.get2D(src,i,j));
      }
     }
     return;
    },
    skip:function(i,ar)
    {
     return i<0?Seq1.nonNegative():i>Arrays.length(ar)?Seq1.insufficient():ar.slice(i);
    },
    skipWhile:function(predicate,ar)
    {
     var len,i;
     len=Arrays.length(ar);
     i=0;
     while(i<len?predicate(Arrays.get(ar,i)):false)
      {
       i=i+1;
      }
     return ar.slice(i);
    },
    sort:function(arr)
    {
     return Arrays.sortBy(function(x)
     {
      return x;
     },arr);
    },
    sortBy:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortByDescending:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return-Operators.Compare(f(x),f(y));
     });
    },
    sortDescending:function(arr)
    {
     return Arrays.sortByDescending(function(x)
     {
      return x;
     },arr);
    },
    sortInPlace:function(arr)
    {
     return Arrays.sortInPlaceBy(function(x)
     {
      return x;
     },arr);
    },
    sortInPlaceBy:function(f,arr)
    {
     return arr.sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlaceWith:function(comparer,arr)
    {
     return arr.sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sortWith:function(comparer,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    splitAt:function(n,ar)
    {
     return[Arrays.take(n,ar),Arrays.skip(n,ar)];
    },
    sub:function(arr,start,length)
    {
     Arrays.checkRange(arr,start,length);
     return arr.slice(start,start+length);
    },
    sub2D:function(src,src1,src2,len1,len2)
    {
     var len11,len21,dst,i,j;
     len11=len1<0?0:len1;
     len21=len2<0?0:len2;
     dst=Arrays.zeroCreate2D(len11,len21);
     for(i=0;i<=len11-1;i++){
      for(j=0;j<=len21-1;j++){
       Arrays.set2D(dst,i,j,Arrays.get2D(src,src1+i,src2+j));
      }
     }
     return dst;
    },
    sum:function($arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$arr[i];
     return sum;
    },
    sumBy:function($f,$arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$f($arr[i]);
     return sum;
    },
    tail:function(ar)
    {
     return Arrays.skip(1,ar);
    },
    take:function(n,ar)
    {
     return n<0?Seq1.nonNegative():n>Arrays.length(ar)?Seq1.insufficient():ar.slice(0,n);
    },
    takeWhile:function(predicate,ar)
    {
     var len,i;
     len=Arrays.length(ar);
     i=0;
     while(i<len?predicate(Arrays.get(ar,i)):false)
      {
       i=i+1;
      }
     return ar.slice(0,i);
    },
    truncate:function(n,ar)
    {
     return ar.slice(n);
    },
    tryFind:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:Arrays.get(arr,i)
       }:null;
       i=i+1;
      }
     return res;
    },
    tryFindIndex:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:i
       }:null;
       i=i+1;
      }
     return res;
    },
    tryHead:function(arr)
    {
     return Arrays.length(arr)===0?{
      $:0
     }:{
      $:1,
      $0:arr[0]
     };
    },
    tryItem:function(i,arr)
    {
     return(Arrays.length(arr)<=i?true:i<0)?{
      $:0
     }:{
      $:1,
      $0:arr[i]
     };
    },
    tryLast:function(arr)
    {
     var len;
     len=Arrays.length(arr);
     return len===0?{
      $:0
     }:{
      $:1,
      $0:arr[len-1]
     };
    },
    tryPick:function(f,arr)
    {
     var res,i,matchValue;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       matchValue=f(Arrays.get(arr,i));
       matchValue.$==1?res=matchValue:null;
       i=i+1;
      }
     return res;
    },
    unfold:function(f,s)
    {
     var source;
     source=Seq1.unfold(f,s);
     return Seq.toArray(source);
    },
    unzip:function(arr)
    {
     var x,y,i,patternInput,b,a;
     x=[];
     y=[];
     for(i=0;i<=arr.length-1;i++){
      patternInput=Arrays.get(arr,i);
      b=patternInput[1];
      a=patternInput[0];
      x.push(a);
      y.push(b);
     }
     return[x,y];
    },
    unzip3:function(arr)
    {
     var x,y,z,i,matchValue,c,b,a;
     x=[];
     y=[];
     z=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=Arrays.get(arr,i);
      c=matchValue[2];
      b=matchValue[1];
      a=matchValue[0];
      x.push(a);
      y.push(b);
      z.push(c);
     }
     return[x,y,z];
    },
    windowed:function(windowSize,s)
    {
     var source;
     source=Seq1.windowed(windowSize,s);
     return Seq.toArray(source);
    },
    zeroCreate2D:function(n,m)
    {
     var arr;
     arr=Arrays.init(n,function()
     {
      return Array(m);
     });
     arr.dims=2;
     return arr;
    },
    zip:function(arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i)]);
     }
     return res;
    },
    zip3:function(arr1,arr2,arr3)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     Arrays.checkLength(arr2,arr3);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i),Arrays.get(arr3,i)]);
     }
     return res;
    }
   },
   Arrays2D:{
    copy:function(array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return Arrays.get2D(array,i,j);
      };
     });
    },
    init:function(n,m,f)
    {
     var array,i,j;
     array=Arrays.zeroCreate2D(n,m);
     for(i=0;i<=n-1;i++){
      for(j=0;j<=m-1;j++){
       Arrays.set2D(array,i,j,(f(i))(j));
      }
     }
     return array;
    },
    iter:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       f(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    iteri:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       ((f(i))(j))(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    map:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return f(Arrays.get2D(array,i,j));
      };
     });
    },
    mapi:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return((f(i))(j))(Arrays.get2D(array,i,j));
      };
     });
    }
   },
   AsyncProxy:Runtime.Class({},{
    get_CancellationToken:function()
    {
     return Concurrency.GetCT();
    },
    get_DefaultCancellationToken:function()
    {
     return(Concurrency.defCTS())[0];
    }
   }),
   CancellationTokenSource:Runtime.Class({
    Cancel:function()
    {
     var _,chooser,array,errors;
     if(!this.c)
      {
       this.c=true;
       chooser=function(a)
       {
        var _1,e;
        try
        {
         a(null);
         _1={
          $:0
         };
        }
        catch(e)
        {
         _1={
          $:1,
          $0:e
         };
        }
        return _1;
       };
       array=this.r;
       errors=Arrays.choose(chooser,array);
       _=Arrays.length(errors)>0?Operators.Raise(AggregateException.New(errors)):null;
      }
     else
      {
       _=null;
      }
     return _;
    },
    Cancel1:function(throwOnFirstException)
    {
     var _,_1,action,array;
     if(!throwOnFirstException)
      {
       _=this.Cancel();
      }
     else
      {
       if(!this.c)
        {
         this.c=true;
         action=function(a)
         {
          return a(null);
         };
         array=this.r;
         _1=Arrays.iter(action,array);
        }
       else
        {
         _1=null;
        }
       _=_1;
      }
     return _;
    },
    CancelAfter:function(delay)
    {
     var _,option,arg0,_this=this;
     if(!this.c)
      {
       option=this.pending;
       Option.iter(function(handle)
       {
        return clearTimeout(handle);
       },option);
       arg0=setTimeout(function()
       {
        return _this.Cancel();
       },delay);
       _=void(this.pending={
        $:1,
        $0:arg0
       });
      }
     else
      {
       _=null;
      }
     return _;
    },
    get_IsCancellationRequested:function()
    {
     return this.c;
    }
   },{
    CreateLinkedTokenSource:function(t1,t2)
    {
     return CancellationTokenSource.CreateLinkedTokenSource1([t1,t2]);
    },
    CreateLinkedTokenSource1:function(tokens)
    {
     var cts,action;
     cts=CancellationTokenSource.New();
     action=function(t)
     {
      var value;
      value=Concurrency.Register(t,function()
      {
       return function()
       {
        return cts.Cancel();
       }();
      });
      return;
     };
     return Arrays.iter(action,tokens);
    },
    New:function()
    {
     var r;
     r=Runtime.New(this,{});
     r.c=false;
     r.pending={
      $:0
     };
     r.r=[];
     return r;
    }
   }),
   Char:Runtime.Class({},{
    GetNumericValue:function(c)
    {
     return(c>=48?c<=57:false)?Number(c)-Number(48):-1;
    },
    IsControl:function(c)
    {
     return(c>=0?c<=31:false)?true:c>=128?c<=159:false;
    },
    IsDigit:function(c)
    {
     return c>=48?c<=57:false;
    },
    IsLetter:function(c)
    {
     return(c>=65?c<=90:false)?true:c>=97?c<=122:false;
    },
    IsLetterOrDigit:function(c)
    {
     return Char.IsLetter(c)?true:Char.IsDigit(c);
    },
    IsLower:function(c)
    {
     return c>=97?c<=122:false;
    },
    IsUpper:function(c)
    {
     return c>=65?c<=90:false;
    },
    IsWhiteSpace:function($c)
    {
     var $0=this,$this=this;
     return Global.String.fromCharCode($c).match(/\s/)!==null;
    },
    Parse:function(s)
    {
     return s.length===1?s.charCodeAt(0):Operators.FailWith("String must be exactly one character long.");
    }
   }),
   Concurrency:{
    AwaitEvent:function(e,ca)
    {
     var r;
     r=function(c)
     {
      var sub,sub1,creg,creg1,sub2,creg2;
      sub=function()
      {
       return Util.subscribeTo(e,function(x)
       {
        var action;
        Lazy.Force(sub1).Dispose();
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:x
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      sub1=Lazy.Create(sub);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var _,ca1,action;
        if(ca.$==1)
         {
          ca1=ca.$0;
          _=ca1(null);
         }
        else
         {
          Lazy.Force(sub1).Dispose();
          action=function()
          {
           return c.k.call(null,{
            $:2,
            $0:OperationCanceledException.New()
           });
          };
          _=Concurrency.scheduler().Fork(action);
         }
        return _;
       });
      };
      creg1=Lazy.Create(creg);
      sub2=Lazy.Force(sub1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Bind:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,action,action1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          action=function()
          {
           var _1,e;
           try
           {
            _1=(f(x))(c);
           }
           catch(e)
           {
            _1=c.k.call(null,{
             $:1,
             $0:e
            });
           }
           return _1;
          };
          _=Concurrency.scheduler().Fork(action);
         }
        else
         {
          action1=function()
          {
           return c.k.call(null,_arg1);
          };
          _=Concurrency.scheduler().Fork(action1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Catch:function(r)
    {
     var r1;
     r1=function(c)
     {
      var _,e1;
      try
      {
       _=r({
        k:function(_arg1)
        {
         var _1,x,e;
         if(_arg1.$==0)
          {
           x=_arg1.$0;
           _1=c.k.call(null,{
            $:0,
            $0:{
             $:0,
             $0:x
            }
           });
          }
         else
          {
           if(_arg1.$==1)
            {
             e=_arg1.$0;
             _1=c.k.call(null,{
              $:0,
              $0:{
               $:1,
               $0:e
              }
             });
            }
           else
            {
             _1=c.k.call(null,_arg1);
            }
          }
         return _1;
        },
        ct:c.ct
       });
      }
      catch(e1)
      {
       _=c.k.call(null,{
        $:0,
        $0:{
         $:1,
         $0:e1
        }
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r1);
    },
    Combine:function(a,b)
    {
     return Concurrency.Bind(a,function()
     {
      return b;
     });
    },
    Delay:function(mk)
    {
     var r;
     r=function(c)
     {
      var _,e;
      try
      {
       _=(mk(null))(c);
      }
      catch(e)
      {
       _=c.k.call(null,{
        $:1,
        $0:e
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r);
    },
    For:function(s,b)
    {
     return Concurrency.Using(Enumerator.Get(s),function(ie)
     {
      return Concurrency.While(function()
      {
       return ie.MoveNext();
      },Concurrency.Delay(function()
      {
       return b(ie.get_Current());
      }));
     });
    },
    FromContinuations:function(subscribe)
    {
     var r;
     r=function(c)
     {
      var continued,once;
      continued=[false];
      once=function(cont)
      {
       var _;
       if(continued[0])
        {
         _=Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
        }
       else
        {
         continued[0]=true;
         _=Concurrency.scheduler().Fork(cont);
        }
       return _;
      };
      return subscribe([function(a)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:0,
         $0:a
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:1,
         $0:e
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:2,
         $0:e
        });
       });
      }]);
     };
     return Concurrency.checkCancel(r);
    },
    GetCT:Runtime.Field(function()
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    }),
    Ignore:function(r)
    {
     return Concurrency.Bind(r,function()
     {
      return Concurrency.Return(null);
     });
    },
    OnCancel:function(action)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:Concurrency.Register(c.ct,action)
      });
     };
     return Concurrency.checkCancel(r);
    },
    Parallel:function(cs)
    {
     var cs1,_,r;
     cs1=Arrays.ofSeq(cs);
     if(Arrays.length(cs1)===0)
      {
       _=Concurrency.Return([]);
      }
     else
      {
       r=function(c)
       {
        var n,o,a,accept;
        n=cs1.length;
        o=[n];
        a=Arrays.create(n,undefined);
        accept=function(i)
        {
         return function(x)
         {
          var matchValue,_1,_2,x1,res,_3,x2,n1,res1;
          matchValue=[o[0],x];
          if(matchValue[0]===0)
           {
            _1=null;
           }
          else
           {
            if(matchValue[0]===1)
             {
              if(matchValue[1].$==0)
               {
                x1=matchValue[1].$0;
                Arrays.set(a,i,x1);
                o[0]=0;
                _2=c.k.call(null,{
                 $:0,
                 $0:a
                });
               }
              else
               {
                matchValue[0];
                res=matchValue[1];
                o[0]=0;
                _2=c.k.call(null,res);
               }
              _1=_2;
             }
            else
             {
              if(matchValue[1].$==0)
               {
                x2=matchValue[1].$0;
                n1=matchValue[0];
                Arrays.set(a,i,x2);
                _3=void(o[0]=n1-1);
               }
              else
               {
                matchValue[0];
                res1=matchValue[1];
                o[0]=0;
                _3=c.k.call(null,res1);
               }
              _1=_3;
             }
           }
          return _1;
         };
        };
        return Arrays.iteri(function(i)
        {
         return function(run)
         {
          var action;
          action=function()
          {
           return run({
            k:accept(i),
            ct:c.ct
           });
          };
          return Concurrency.scheduler().Fork(action);
         };
        },cs1);
       };
       _=Concurrency.checkCancel(r);
      }
     return _;
    },
    Register:function(ct,callback)
    {
     var i;
     i=ct.r.push(callback)-1;
     return{
      Dispose:function()
      {
       return Arrays.set(ct.r,i,function()
       {
       });
      }
     };
    },
    Return:function(x)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:x
      });
     };
     return Concurrency.checkCancel(r);
    },
    Scheduler:Runtime.Class({
     Fork:function(action)
     {
      var _,value,_this=this;
      this.robin.push(action);
      if(this.idle)
       {
        this.idle=false;
        value=setTimeout(function()
        {
         return _this.tick();
        },0);
        _=void value;
       }
      else
       {
        _=null;
       }
      return _;
     },
     tick:function()
     {
      var t,loop,matchValue,_,_1,value,_this=this;
      t=Date.now();
      loop=true;
      while(loop)
       {
        matchValue=this.robin.length;
        if(matchValue===0)
         {
          this.idle=true;
          _=loop=false;
         }
        else
         {
          (this.robin.shift())(null);
          if(Date.now()-t>40)
           {
            value=setTimeout(function()
            {
             return _this.tick();
            },0);
            _1=loop=false;
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
       }
      return;
     }
    },{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.idle=true;
      r.robin=[];
      return r;
     }
    }),
    Sleep:function(ms)
    {
     var r;
     r=function(c)
     {
      var pending,pending1,creg,creg1,pending2,creg2;
      pending=function()
      {
       return setTimeout(function()
       {
        var action;
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:null
         });
        };
        return Concurrency.scheduler().Fork(action);
       },ms);
      };
      pending1=Lazy.Create(pending);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        clearTimeout(Lazy.Force(pending1));
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      pending2=Lazy.Force(pending1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Start:function(c,ctOpt)
    {
     return Concurrency.StartWithContinuations(c,function()
     {
     },function(exn)
     {
      var ps;
      ps=[exn];
      return console?console.log.apply(console,["WebSharper: Uncaught asynchronous exception"].concat(ps)):undefined;
     },function()
     {
     },ctOpt);
    },
    StartChild:function(r,t)
    {
     var r1;
     r1=function(c)
     {
      var inTime,cached,queue,tReg,_,timeout,arg0,action,r3,r21;
      inTime=[true];
      cached=[{
       $:0
      }];
      queue=[];
      if(t.$==1)
       {
        timeout=t.$0;
        arg0=setTimeout(function()
        {
         var err;
         inTime[0]=false;
         err={
          $:1,
          $0:TimeoutException.New()
         };
         while(queue.length>0)
          {
           (queue.shift())(err);
          }
         return;
        },timeout);
        _={
         $:1,
         $0:arg0
        };
       }
      else
       {
        _={
         $:0
        };
       }
      tReg=_;
      action=function()
      {
       return r({
        k:function(res)
        {
         var _1,_2,r2;
         if(inTime[0])
          {
           cached[0]={
            $:1,
            $0:res
           };
           if(tReg.$==1)
            {
             r2=tReg.$0;
             _2=clearTimeout(r2);
            }
           else
            {
             _2=null;
            }
           while(queue.length>0)
            {
             (queue.shift())(res);
            }
          }
         else
          {
           _1=null;
          }
         return _1;
        },
        ct:c.ct
       });
      };
      Concurrency.scheduler().Fork(action);
      r3=function(c2)
      {
       var _1,matchValue,_2,x;
       if(inTime[0])
        {
         matchValue=cached[0];
         if(matchValue.$==0)
          {
           _2=queue.push(c2.k);
          }
         else
          {
           x=matchValue.$0;
           _2=c2.k.call(null,x);
          }
         _1=_2;
        }
       else
        {
         _1=c2.k.call(null,{
          $:1,
          $0:TimeoutException.New()
         });
        }
       return _1;
      };
      r21=Concurrency.checkCancel(r3);
      return c.k.call(null,{
       $:0,
       $0:r21
      });
     };
     return Concurrency.checkCancel(r1);
    },
    StartWithContinuations:function(c,s,f,cc,ctOpt)
    {
     var ct,action;
     ct=Operators.DefaultArg(ctOpt,(Concurrency.defCTS())[0]);
     action=function()
     {
      return c({
       k:function(_arg1)
       {
        var _,e,e1,x;
        if(_arg1.$==1)
         {
          e=_arg1.$0;
          _=f(e);
         }
        else
         {
          if(_arg1.$==2)
           {
            e1=_arg1.$0;
            _=cc(e1);
           }
          else
           {
            x=_arg1.$0;
            _=s(x);
           }
         }
        return _;
       },
       ct:ct
      });
     };
     return Concurrency.scheduler().Fork(action);
    },
    TryCancelled:function(run,comp)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(_arg1)
       {
        var _,e;
        if(_arg1.$==2)
         {
          e=_arg1.$0;
          comp(e);
          _=c.k.call(null,_arg1);
         }
        else
         {
          _=c.k.call(null,_arg1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryFinally:function(run,f)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(r1)
       {
        var _,e;
        try
        {
         f(null);
         _=c.k.call(null,r1);
        }
        catch(e)
        {
         _=c.k.call(null,{
          $:1,
          $0:e
         });
        }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryWith:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,e,_1,e1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          _=c.k.call(null,{
           $:0,
           $0:x
          });
         }
        else
         {
          if(_arg1.$==1)
           {
            e=_arg1.$0;
            try
            {
             _1=(f(e))(c);
            }
            catch(e1)
            {
             _1=c.k.call(null,_arg1);
            }
            _=_1;
           }
          else
           {
            _=c.k.call(null,_arg1);
           }
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Using:function(x,f)
    {
     return Concurrency.TryFinally(f(x),function()
     {
      return x.Dispose();
     });
    },
    While:function(g,c)
    {
     return g(null)?Concurrency.Bind(c,function()
     {
      return Concurrency.While(g,c);
     }):Concurrency.Return(null);
    },
    checkCancel:function(r)
    {
     return function(c)
     {
      return c.ct.c?c.k.call(null,{
       $:2,
       $0:OperationCanceledException.New()
      }):r(c);
     };
    },
    defCTS:Runtime.Field(function()
    {
     return[CancellationTokenSource.New()];
    }),
    scheduler:Runtime.Field(function()
    {
     return Scheduler.New();
    })
   },
   Control:{
    createEvent:function(add,remove,create)
    {
     return{
      AddHandler:add,
      RemoveHandler:remove,
      Subscribe:function(r)
      {
       var h;
       h=create(function()
       {
        return function(args)
        {
         return r.OnNext.call(null,args);
        };
       });
       add(h);
       return{
        Dispose:function()
        {
         return remove(h);
        }
       };
      }
     };
    }
   },
   DateTimeHelpers:{
    AddMonths:function(d,months)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth()+months,e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    AddYears:function(d,years)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear()+years,e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    DatePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth(),e.getDate())).getTime();
    },
    LongDate:function($d)
    {
     var $0=this,$this=this;
     return(new Global.Date($d)).toLocaleDateString({},{
      year:"numeric",
      month:"long",
      day:"numeric",
      weekday:"long"
     });
    },
    LongTime:function($d)
    {
     var $0=this,$this=this;
     return(new Global.Date($d)).toLocaleTimeString({},{
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit",
      hour12:false
     });
    },
    Parse:function(s)
    {
     var d;
     d=Date.parse(s);
     return Global.isNaN(d)?Operators.FailWith("Failed to parse date string."):d;
    },
    ShortTime:function($d)
    {
     var $0=this,$this=this;
     return(new Global.Date($d)).toLocaleTimeString({},{
      hour:"2-digit",
      minute:"2-digit",
      hour12:false
     });
    },
    TimePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(((24*0+e.getHours())*60+e.getMinutes())*60+e.getSeconds())*1000+e.getMilliseconds();
    }
   },
   Enumerable:{
    Of:function(getEnumerator)
    {
     return{
      GetEnumerator:getEnumerator
     };
    }
   },
   Enumerator:{
    Get:function(x)
    {
     return x instanceof Global.Array?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<Arrays.length(x))
       {
        e.c=Arrays.get(x,i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },function()
     {
     }):Unchecked.Equals(typeof x,"string")?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<x.length)
       {
        e.c=x.charCodeAt(i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },function()
     {
     }):x.GetEnumerator();
    },
    T:Runtime.Class({
     Dispose:function()
     {
      return this.d.call(null,this);
     },
     MoveNext:function()
     {
      return this.n.call(null,this);
     },
     get_Current:function()
     {
      return this.c;
     }
    },{
     New:function(s,c,n,d)
     {
      var r;
      r=Runtime.New(this,{});
      r.s=s;
      r.c=c;
      r.n=n;
      r.d=d;
      return r;
     }
    })
   },
   Exception:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,Exception.New1("Exception of type 'System.Exception' was thrown."));
    },
    New1:function($message)
    {
     var $0=this,$this=this;
     return new Global.Error($message);
    }
   }),
   Guid:Runtime.Class({},{
    NewGuid:function()
    {
     var $0=this,$this=this;
     return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c)
     {
      var r=Global.Math.random()*16|0,v=c=="x"?r:r&0x3|0x8;
      return v.toString(16);
     });
    }
   }),
   HtmlContentExtensions:{
    "IControlBody.SingleNode.Static":function(node)
    {
     return SingleNode.New(node);
    },
    SingleNode:Runtime.Class({
     ReplaceInDom:function(old)
     {
      var value;
      value=this.node.parentNode.replaceChild(this.node,old);
      return;
     }
    },{
     New:function(node)
     {
      var r;
      r=Runtime.New(this,{});
      r.node=node;
      return r;
     }
    })
   },
   IndexOutOfRangeException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,IndexOutOfRangeException.New1("Index was outside the bounds of the array."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   InvalidOperationException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,InvalidOperationException.New1("Operation is not valid due to the current state of the object."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   JavaScript:{
    JSModule:{
     Delete:function($x,$field)
     {
      var $0=this,$this=this;
      return delete $x[$field];
     },
     ForEach:function($x,$iter)
     {
      var $0=this,$this=this;
      for(var k in $x){
       if($iter(k))
        break;
      }
     },
     GetFieldNames:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push(k);
      return r;
     },
     GetFieldValues:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push($o[k]);
      return r;
     },
     GetFields:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push([k,$o[k]]);
      return r;
     },
     Log:function($x)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log($x);
     },
     LogMore:function($args)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log.apply(Global.console,$args);
     }
    },
    Pervasives:{
     NewFromList:function(fields)
     {
      var r,enumerator,_,forLoopVar,v,k;
      r={};
      enumerator=Enumerator.Get(fields);
      try
      {
       while(enumerator.MoveNext())
        {
         forLoopVar=enumerator.get_Current();
         v=forLoopVar[1];
         k=forLoopVar[0];
         r[k]=v;
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return r;
     }
    }
   },
   Json:{
    Activate:function(json)
    {
     var types,i,decode;
     types=json.$TYPES;
     for(i=0;i<=Arrays.length(types)-1;i++){
      Arrays.set(types,i,Json.lookup(Arrays.get(types,i)));
     }
     decode=function(x)
     {
      var _,matchValue,_1,_2,o,ti,_3,r;
      if(Unchecked.Equals(x,null))
       {
        _=x;
       }
      else
       {
        matchValue=typeof x;
        if(matchValue==="object")
         {
          if(x instanceof Global.Array)
           {
            _2=Json.shallowMap(decode,x);
           }
          else
           {
            o=Json.shallowMap(decode,x.$V);
            ti=x.$T;
            if(Unchecked.Equals(typeof ti,"undefined"))
             {
              _3=o;
             }
            else
             {
              r=new(Arrays.get(types,ti))();
              JSModule.ForEach(o,function(k)
              {
               r[k]=o[k];
               return false;
              });
              _3=r;
             }
            _2=_3;
           }
          _1=_2;
         }
        else
         {
          _1=x;
         }
        _=_1;
       }
      return _;
     };
     return decode(json.$DATA);
    },
    lookup:function(x)
    {
     var k,r,i,n,rn,_;
     k=Arrays.length(x);
     r=Global;
     i=0;
     while(i<k)
      {
       n=Arrays.get(x,i);
       rn=r[n];
       if(!Unchecked.Equals(typeof rn,undefined))
        {
         r=rn;
         _=i=i+1;
        }
       else
        {
         _=Operators.FailWith("Invalid server reply. Failed to find type: "+n);
        }
      }
     return r;
    },
    shallowMap:function(f,x)
    {
     var _,matchValue,_1,r;
     if(x instanceof Global.Array)
      {
       _=Arrays.map(f,x);
      }
     else
      {
       matchValue=typeof x;
       if(matchValue==="object")
        {
         r={};
         JSModule.ForEach(x,function(y)
         {
          r[y]=f(x[y]);
          return false;
         });
         _1=r;
        }
       else
        {
         _1=x;
        }
       _=_1;
      }
     return _;
    }
   },
   Lazy:{
    Create:function(f)
    {
     var x,get;
     x={
      value:undefined,
      created:false,
      eval:f
     };
     get=function()
     {
      var _;
      if(x.created)
       {
        _=x.value;
       }
      else
       {
        x.created=true;
        x.value=f(null);
        _=x.value;
       }
      return _;
     };
     x.eval=get;
     return x;
    },
    CreateFromValue:function(v)
    {
     return{
      value:v,
      created:true,
      eval:function()
      {
       return v;
      },
      eval:function()
      {
       return v;
      }
     };
    },
    Force:function(x)
    {
     return x.eval.call(null,null);
    }
   },
   List:{
    T:Runtime.Class({
     GetEnumerator:function()
     {
      return T.New(this,null,function(e)
      {
       var matchValue,_,xs,x;
       matchValue=e.s;
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         xs=matchValue.$1;
         x=matchValue.$0;
         e.c=x;
         e.s=xs;
         _=true;
        }
       return _;
      },function()
      {
      });
     },
     GetSlice:function(start,finish)
     {
      var matchValue,_,_1,i,j,count,source,source1,i1,_2,j1,count1,source2;
      matchValue=[start,finish];
      if(matchValue[0].$==1)
       {
        if(matchValue[1].$==1)
         {
          i=matchValue[0].$0;
          j=matchValue[1].$0;
          count=j-i+1;
          source=List1.skip(i,this);
          source1=Seq.take(count,source);
          _1=List.ofSeq(source1);
         }
        else
         {
          i1=matchValue[0].$0;
          _1=List1.skip(i1,this);
         }
        _=_1;
       }
      else
       {
        if(matchValue[1].$==1)
         {
          j1=matchValue[1].$0;
          count1=j1+1;
          source2=Seq.take(count1,this);
          _2=List.ofSeq(source2);
         }
        else
         {
          _2=this;
         }
        _=_2;
       }
      return _;
     },
     get_Item:function(x)
     {
      return Seq.nth(x,this);
     },
     get_Length:function()
     {
      return Seq.length(this);
     }
    }),
    append:function(x,y)
    {
     return List.ofSeq(Seq.append(x,y));
    },
    choose:function(f,l)
    {
     return List.ofSeq(Seq.choose(f,l));
    },
    chunkBySize:function(size,list)
    {
     var mapping,source,list1;
     mapping=function(array)
     {
      return List.ofArray(array);
     };
     source=Seq1.chunkBySize(size,list);
     list1=Seq.toList(source);
     return List.map(mapping,list1);
    },
    collect:function(f,l)
    {
     return List.ofSeq(Seq.collect(f,l));
    },
    compareWith:function(f,l1,l2)
    {
     return Seq1.compareWith(f,l1,l2);
    },
    concat:function(s)
    {
     return List.ofSeq(Seq.concat(s));
    },
    contains:function(el,l)
    {
     return Seq1.contains(el,l);
    },
    countBy:function(f,l)
    {
     var source;
     source=Seq1.countBy(f,l);
     return Seq.toList(source);
    },
    distinct:function(l)
    {
     var source;
     source=Seq1.distinct(l);
     return Seq.toList(source);
    },
    distinctBy:function(f,l)
    {
     var source;
     source=Seq1.distinctBy(f,l);
     return Seq.toList(source);
    },
    exactlyOne:function(list)
    {
     var _,_1,head;
     if(list.$==1)
      {
       if(list.$1.$==0)
        {
         head=list.$0;
         _1=head;
        }
       else
        {
         _1=Operators.FailWith("The input does not have precisely one element.");
        }
       _=_1;
      }
     else
      {
       _=Operators.FailWith("The input does not have precisely one element.");
      }
     return _;
    },
    except:function(itemsToExclude,l)
    {
     var source;
     source=Seq1.except(itemsToExclude,l);
     return Seq.toList(source);
    },
    exists2:function(p,l1,l2)
    {
     return Arrays.exists2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    filter:function(p,l)
    {
     return List.ofSeq(Seq.filter(p,l));
    },
    findBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=List.tryFindBack(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndexBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindIndexBack(p,Arrays.ofSeq(s));
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold2:function(f,s,l1,l2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    foldBack:function(f,l,s)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(l),s);
    },
    foldBack2:function(f,l1,l2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2),s);
    },
    forall2:function(p,l1,l2)
    {
     return Arrays.forall2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    groupBy:function(f,l)
    {
     var mapping,source,list;
     mapping=function(tupledArg)
     {
      var k,s;
      k=tupledArg[0];
      s=tupledArg[1];
      return[k,Seq.toList(s)];
     };
     source=Seq1.groupBy(f,l);
     list=Seq.toList(source);
     return List.map(mapping,list);
    },
    head:function(l)
    {
     var _,h;
     if(l.$==1)
      {
       h=l.$0;
       _=h;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    indexed:function(list)
    {
     return List.mapi(function(a)
     {
      return function(b)
      {
       return[a,b];
      };
     },list);
    },
    init:function(s,f)
    {
     return List.ofArray(Arrays.init(s,f));
    },
    iter2:function(f,l1,l2)
    {
     return Arrays.iter2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    iteri2:function(f,l1,l2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    last:function(list)
    {
     return Seq1.last(list);
    },
    map:function(f,l)
    {
     return List.ofSeq(Seq.map(f,l));
    },
    map2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    mapFold:function(f,zero,list)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFold(f,zero,Arrays.ofSeq(list));
     x=tupledArg[0];
     y=tupledArg[1];
     return[List.ofArray(x),y];
    },
    mapFoldBack:function(f,list,zero)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFoldBack(f,Arrays.ofSeq(list),zero);
     x=tupledArg[0];
     y=tupledArg[1];
     return[List.ofArray(x),y];
    },
    mapi:function(f,l)
    {
     return List.ofSeq(Seq.mapi(f,l));
    },
    mapi2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.mapi2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    max:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },l);
    },
    maxBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },l);
    },
    min:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },l);
    },
    minBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },l);
    },
    ofArray:function(arr)
    {
     var r,i;
     r=Runtime.New(T1,{
      $:0
     });
     for(i=0;i<=Arrays.length(arr)-1;i++){
      r=Runtime.New(T1,{
       $:1,
       $0:Arrays.get(arr,Arrays.length(arr)-i-1),
       $1:r
      });
     }
     return r;
    },
    ofSeq:function(s)
    {
     var res,last,e,_,next;
     res=Runtime.New(T1,{
      $:0
     });
     last=res;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        last.$=1;
        next=Runtime.New(T1,{
         $:0
        });
        last.$0=e.get_Current();
        last.$1=next;
        last=next;
       }
      last.$=0;
      _=res;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    pairwise:function(l)
    {
     var source;
     source=Seq1.pairwise(l);
     return Seq.toList(source);
    },
    partition:function(p,l)
    {
     var patternInput,b,a;
     patternInput=Arrays.partition(p,Arrays.ofSeq(l));
     b=patternInput[1];
     a=patternInput[0];
     return[List.ofArray(a),List.ofArray(b)];
    },
    permute:function(f,l)
    {
     return List.ofArray(Arrays.permute(f,Arrays.ofSeq(l)));
    },
    reduceBack:function(f,l)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(l));
    },
    replicate:function(size,value)
    {
     return List.ofArray(Arrays.create(size,value));
    },
    rev:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     a.reverse();
     return List.ofArray(a);
    },
    scan:function(f,s,l)
    {
     return List.ofSeq(Seq.scan(f,s,l));
    },
    scanBack:function(f,l,s)
    {
     return List.ofArray(Arrays.scanBack(f,Arrays.ofSeq(l),s));
    },
    singleton:function(x)
    {
     return List.ofArray([x]);
    },
    sort:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlace(a);
     return List.ofArray(a);
    },
    sortBy:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortByDescending:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return-Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortDescending:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays1.sortInPlaceByDescending(function(x)
     {
      return x;
     },a);
     return List.ofArray(a);
    },
    sortWith:function(f,l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlaceWith(f,a);
     return List.ofArray(a);
    },
    splitAt:function(n,list)
    {
     return[List.ofSeq(Seq.take(n,list)),List1.skip(n,list)];
    },
    splitInto:function(count,list)
    {
     var mapping,array1,list1;
     mapping=function(array)
     {
      return List.ofArray(array);
     };
     array1=Arrays1.splitInto(count,Arrays.ofSeq(list));
     list1=List.ofArray(array1);
     return List.map(mapping,list1);
    },
    tail:function(l)
    {
     var _,t;
     if(l.$==1)
      {
       t=l.$1;
       _=t;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    tryFindBack:function(ok,l)
    {
     return Arrays1.tryFindBack(ok,Arrays.ofSeq(l));
    },
    tryHead:function(list)
    {
     var _,head;
     if(list.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       head=list.$0;
       _={
        $:1,
        $0:head
       };
      }
     return _;
    },
    tryItem:function(n,list)
    {
     return Seq1.tryItem(n,list);
    },
    tryLast:function(list)
    {
     return Seq1.tryLast(list);
    },
    unfold:function(f,s)
    {
     var source;
     source=Seq1.unfold(f,s);
     return Seq.toList(source);
    },
    unzip:function(l)
    {
     var x,y,enumerator,_,forLoopVar,b,a;
     x=[];
     y=[];
     enumerator=Enumerator.Get(l);
     try
     {
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        b=forLoopVar[1];
        a=forLoopVar[0];
        x.push(a);
        y.push(b);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0))];
    },
    unzip3:function(l)
    {
     var x,y,z,enumerator,_,forLoopVar,c,b,a;
     x=[];
     y=[];
     z=[];
     enumerator=Enumerator.Get(l);
     try
     {
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        c=forLoopVar[2];
        b=forLoopVar[1];
        a=forLoopVar[0];
        x.push(a);
        y.push(b);
        z.push(c);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0)),List.ofArray(z.slice(0))];
    },
    windowed:function(windowSize,s)
    {
     var mapping,source,source1;
     mapping=function(array)
     {
      return List.ofArray(array);
     };
     source=Seq1.windowed(windowSize,s);
     source1=Seq.map(mapping,source);
     return Seq.toList(source1);
    },
    zip:function(l1,l2)
    {
     return List.ofArray(Arrays.zip(Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    zip3:function(l1,l2,l3)
    {
     return List.ofArray(Arrays.zip3(Arrays.ofSeq(l1),Arrays.ofSeq(l2),Arrays.ofSeq(l3)));
    }
   },
   MatchFailureException:Runtime.Class({},{
    New:function(message,line,column)
    {
     return Runtime.New(this,Exception.New1(message+" at "+Global.String(line)+":"+Global.String(column)));
    }
   }),
   Nullable:{
    get:function(x)
    {
     return x==null?Operators.FailWith("Nullable object must have a value."):x;
    },
    getOrValue:function(x,v)
    {
     return x==null?v:x;
    }
   },
   OperationCanceledException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,OperationCanceledException.New1("The operation was canceled."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Operators:{
    Compare:function(a,b)
    {
     return Unchecked.Compare(a,b);
    },
    DefaultArg:function(x,d)
    {
     var _,x1;
     if(x.$==0)
      {
       _=d;
      }
     else
      {
       x1=x.$0;
       _=x1;
      }
     return _;
    },
    FailWith:function(msg)
    {
     return Operators.Raise(Exception.New1(msg));
    },
    KeyValue:function(kvp)
    {
     return[kvp.K,kvp.V];
    },
    Max:function(a,b)
    {
     return Unchecked.Compare(a,b)===1?a:b;
    },
    Min:function(a,b)
    {
     return Unchecked.Compare(a,b)===-1?a:b;
    },
    Pown:function(a,n)
    {
     var p;
     p=function(n1)
     {
      var _,_1,b;
      if(n1===1)
       {
        _=a;
       }
      else
       {
        if(n1%2===0)
         {
          b=p(n1/2>>0);
          _1=b*b;
         }
        else
         {
          _1=a*p(n1-1);
         }
        _=_1;
       }
      return _;
     };
     return p(n);
    },
    Raise:function($e)
    {
     var $0=this,$this=this;
     throw $e;
    },
    Sign:function(x)
    {
     return x===0?0:x<0?-1:1;
    },
    Truncate:function(x)
    {
     return x<0?Math.ceil(x):Math.floor(x);
    },
    Using:function(t,f)
    {
     var _;
     try
     {
      _=f(t);
     }
     finally
     {
      t.Dispose();
     }
     return _;
    },
    range:function(min,max)
    {
     var count;
     count=1+max-min;
     return count<=0?Seq.empty():Seq.init(count,function(x)
     {
      return x+min;
     });
    },
    step:function(min,step,max)
    {
     var s,predicate,source,x;
     s=Operators.Sign(step);
     predicate=function(k)
     {
      return s*(max-k)>=0;
     };
     source=Seq.initInfinite(function(k)
     {
      return min+k*step;
     });
     x=Seq.takeWhile(predicate,source);
     return x;
    }
   },
   Option:{
    bind:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _=f(x1);
      }
     return _;
    },
    exists:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=false;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    filter:function(f,o)
    {
     var _,v;
     if(o.$==1)
      {
       v=o.$0;
       _=f(v)?{
        $:1,
        $0:v
       }:{
        $:0
       };
      }
     else
      {
       _={
        $:0
       };
      }
     return _;
    },
    fold:function(f,s,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(s))(x1);
      }
     return _;
    },
    foldBack:function(f,x,s)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(x1))(s);
      }
     return _;
    },
    forall:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=true;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    iter:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=null;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    map:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _={
        $:1,
        $0:f(x1)
       };
      }
     return _;
    },
    ofObj:function(o)
    {
     return o==null?{
      $:0
     }:{
      $:1,
      $0:o
     };
    },
    toArray:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=[];
      }
     else
      {
       x1=x.$0;
       _=[x1];
      }
     return _;
    },
    toList:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=Runtime.New(T1,{
        $:0
       });
      }
     else
      {
       x1=x.$0;
       _=List.ofArray([x1]);
      }
     return _;
    },
    toObj:function(o)
    {
     var _,v;
     if(o.$==0)
      {
      }
     else
      {
       v=o.$0;
       _=v;
      }
     return _;
    }
   },
   PrintfHelpers:{
    padNumLeft:function(s,l)
    {
     var f;
     f=Arrays.get(s,0);
     return((f===" "?true:f==="+")?true:f==="-")?f+Strings.PadLeftWith(s.substr(1),l-1,48):Strings.PadLeftWith(s,l,48);
    },
    plusForPos:function(n,s)
    {
     return 0<=n?"+"+s:s;
    },
    prettyPrint:function(o)
    {
     var printObject,t,_1,_2,_3,mapping1,strings1;
     printObject=function(o1)
     {
      var s,_,mapping,array,strings;
      s=Global.String(o1);
      if(s==="[object Object]")
       {
        mapping=function(tupledArg)
        {
         var k,v;
         k=tupledArg[0];
         v=tupledArg[1];
         return k+" = "+PrintfHelpers.prettyPrint(v);
        };
        array=JSModule.GetFields(o1);
        strings=Arrays.map(mapping,array);
        _="{"+Strings.concat("; ",strings)+"}";
       }
      else
       {
        _=s;
       }
      return _;
     };
     t=typeof o;
     if(t=="string")
      {
       _1="\""+o+"\"";
      }
     else
      {
       if(t=="object")
        {
         if(o instanceof Global.Array)
          {
           mapping1=function(o1)
           {
            return PrintfHelpers.prettyPrint(o1);
           };
           strings1=Arrays.map(mapping1,o);
           _3="[|"+Strings.concat("; ",strings1)+"|]";
          }
         else
          {
           _3=printObject(o);
          }
         _2=_3;
        }
       else
        {
         _2=Global.String(o);
        }
       _1=_2;
      }
     return _1;
    },
    printArray:function(p,o)
    {
     var strings;
     strings=Arrays.map(p,o);
     return"[|"+Strings.concat("; ",strings)+"|]";
    },
    printArray2D:function(p,o)
    {
     var strings;
     strings=Seq.delay(function()
     {
      var l2;
      l2=o.length?o[0].length:0;
      return Seq.map(function(i)
      {
       var strings1;
       strings1=Seq.delay(function()
       {
        return Seq.map(function(j)
        {
         return p(Arrays.get2D(o,i,j));
        },Operators.range(0,l2-1));
       });
       return Strings.concat("; ",strings1);
      },Operators.range(0,o.length-1));
     });
     return"[["+Strings.concat("][",strings)+"]]";
    },
    printList:function(p,o)
    {
     var strings;
     strings=Seq.map(p,o);
     return"["+Strings.concat("; ",strings)+"]";
    },
    spaceForPos:function(n,s)
    {
     return 0<=n?" "+s:s;
    },
    toSafe:function(s)
    {
     return s==null?"":s;
    }
   },
   Queue:{
    Clear:function(a)
    {
     return a.splice(0,Arrays.length(a));
    },
    Contains:function(a,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },a);
    },
    CopyTo:function(a,array,index)
    {
     return Arrays.blit(a,0,array,index,Arrays.length(a));
    }
   },
   Random:Runtime.Class({
    Next:function()
    {
     return Math.floor(Math.random()*2147483648);
    },
    Next1:function(maxValue)
    {
     return maxValue<0?Operators.FailWith("'maxValue' must be greater than zero."):Math.floor(Math.random()*maxValue);
    },
    Next2:function(minValue,maxValue)
    {
     var _,maxValue1;
     if(minValue>maxValue)
      {
       _=Operators.FailWith("'minValue' cannot be greater than maxValue.");
      }
     else
      {
       maxValue1=maxValue-minValue;
       _=minValue+Math.floor(Math.random()*maxValue1);
      }
     return _;
    },
    NextBytes:function(buffer)
    {
     var i;
     for(i=0;i<=Arrays.length(buffer)-1;i++){
      Arrays.set(buffer,i,Math.floor(Math.random()*256));
     }
     return;
    }
   },{
    New:function()
    {
     return Runtime.New(this,{});
    }
   }),
   Ref:{
    decr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]--);
    },
    incr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]++);
    }
   },
   Remoting:{
    AjaxProvider:Runtime.Field(function()
    {
     return XhrProvider.New();
    }),
    AjaxRemotingProvider:Runtime.Class({},{
     Async:function(m,data)
     {
      var headers,payload;
      headers=Remoting.makeHeaders(m);
      payload=Remoting.makePayload(data);
      return Concurrency.Delay(function()
      {
       var x;
       x=AsyncProxy.get_CancellationToken();
       return Concurrency.Bind(x,function(_arg1)
       {
        return Concurrency.FromContinuations(function(tupledArg)
        {
         var ok,err,cc,waiting,reg,ok1,err1,arg00;
         ok=tupledArg[0];
         err=tupledArg[1];
         cc=tupledArg[2];
         waiting=[true];
         reg=Concurrency.Register(_arg1,function()
         {
          return function()
          {
           var _;
           if(waiting[0])
            {
             waiting[0]=false;
             _=cc(OperationCanceledException.New());
            }
           else
            {
             _=null;
            }
           return _;
          }();
         });
         ok1=function(x1)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=ok(Json.Activate(JSON.parse(x1)));
           }
          else
           {
            _=null;
           }
          return _;
         };
         err1=function(e)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=err(e);
           }
          else
           {
            _=null;
           }
          return _;
         };
         arg00=Remoting.EndPoint();
         return Remoting.AjaxProvider().Async(arg00,headers,payload,ok1,err1);
        });
       });
      });
     },
     Send:function(m,data)
     {
      return Concurrency.Start(Concurrency.Ignore(AjaxRemotingProvider.Async(m,data)),{
       $:0
      });
     },
     Sync:function(m,data)
     {
      var arg00,arg10,arg20,data1;
      arg00=Remoting.EndPoint();
      arg10=Remoting.makeHeaders(m);
      arg20=Remoting.makePayload(data);
      data1=Remoting.AjaxProvider().Sync(arg00,arg10,arg20);
      return Json.Activate(JSON.parse(data1));
     }
    }),
    EndPoint:Runtime.Field(function()
    {
     return"?";
    }),
    UseHttps:function()
    {
     var _,_1,_2,matchValue;
     try
     {
      if(!Strings.StartsWith(window.location.href,"https://"))
       {
        _2=Strings.Replace(window.location.href,"http://","https://");
        Remoting.EndPoint=function()
        {
         return _2;
        };
        _1=true;
       }
      else
       {
        _1=false;
       }
      _=_1;
     }
     catch(matchValue)
     {
      _=false;
     }
     return _;
    },
    XhrProvider:Runtime.Class({
     Async:function(url,headers,data,ok,err)
     {
      return Remoting.ajax(true,url,headers,data,ok,err,function()
      {
       return Remoting.ajax(true,url,headers,data,ok,err,undefined);
      });
     },
     Sync:function(url,headers,data)
     {
      var res;
      res=[undefined];
      Remoting.ajax(false,url,headers,data,function(x)
      {
       res[0]=x;
      },function(e)
      {
       return Operators.Raise(e);
      },function()
      {
       return Remoting.ajax(false,url,headers,data,function(x)
       {
        res[0]=x;
       },function(e)
       {
        return Operators.Raise(e);
       },undefined);
      });
      return res[0];
     }
    },{
     New:function()
     {
      return Runtime.New(this,{});
     }
    }),
    ajax:function($async,$url,$headers,$data,$ok,$err,$csrf)
    {
     var $0=this,$this=this;
     var xhr=new Global.XMLHttpRequest();
     var csrf=Global.document.cookie.replace(new Global.RegExp("(?:(?:^|.*;)\\s*csrftoken\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1");
     xhr.open("POST",$url,$async);
     if($async==true)
      {
       xhr.withCredentials=true;
      }
     for(var h in $headers){
      xhr.setRequestHeader(h,$headers[h]);
     }
     if(csrf)
      {
       xhr.setRequestHeader("x-csrftoken",csrf);
      }
     function k()
     {
      if(xhr.status==200)
       {
        $ok(xhr.responseText);
       }
      else
       if($csrf&&xhr.status==403&&xhr.responseText=="CSRF")
        {
         $csrf();
        }
       else
        {
         var msg="Response status is not 200: ";
         $err(new Global.Error(msg+xhr.status));
        }
     }
     if("onload"in xhr)
      {
       xhr.onload=xhr.onerror=xhr.onabort=k;
      }
     else
      {
       xhr.onreadystatechange=function()
       {
        if(xhr.readyState==4)
         {
          k();
         }
       };
      }
     xhr.send($data);
    },
    makeHeaders:function(m)
    {
     var headers;
     headers={};
     headers["content-type"]="application/json";
     headers["x-websharper-rpc"]=m;
     return headers;
    },
    makePayload:function(data)
    {
     return JSON.stringify(data);
    }
   },
   Seq:{
    append:function(s1,s2)
    {
     return Enumerable.Of(function()
     {
      var e1,first;
      e1=Enumerator.Get(s1);
      first=[true];
      return T.New(e1,null,function(x)
      {
       var _,x1,_1,_2;
       if(x.s.MoveNext())
        {
         x.c=x.s.get_Current();
         _=true;
        }
       else
        {
         x1=x.s;
         !Unchecked.Equals(x1,null)?x1.Dispose():null;
         x.s=null;
         if(first[0])
          {
           first[0]=false;
           x.s=Enumerator.Get(s2);
           if(x.s.MoveNext())
            {
             x.c=x.s.get_Current();
             _2=true;
            }
           else
            {
             x.s.Dispose();
             x.s=null;
             _2=false;
            }
           _1=_2;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      },function(x)
      {
       var x1;
       x1=x.s;
       return!Unchecked.Equals(x1,null)?x1.Dispose():null;
      });
     });
    },
    average:function(s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+x];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    averageBy:function(f,s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+f(x)];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    cache:function(s)
    {
     var cache,_enum,getEnumerator;
     cache=[];
     _enum=[Enumerator.Get(s)];
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var _,en,_1,_2;
       if(e.s+1<cache.length)
        {
         e.s=e.s+1;
         e.c=cache[e.s];
         _=true;
        }
       else
        {
         en=_enum[0];
         if(Unchecked.Equals(en,null))
          {
           _1=false;
          }
         else
          {
           if(en.MoveNext())
            {
             e.s=e.s+1;
             e.c=en.get_Current();
             cache.push(e.get_Current());
             _2=true;
            }
           else
            {
             en.Dispose();
             _enum[0]=null;
             _2=false;
            }
           _1=_2;
          }
         _=_1;
        }
       return _;
      };
      return T.New(0,null,next,function()
      {
      });
     };
     return Enumerable.Of(getEnumerator);
    },
    choose:function(f,s)
    {
     var mapping;
     mapping=function(x)
     {
      var matchValue,_,v;
      matchValue=f(x);
      if(matchValue.$==0)
       {
        _=Runtime.New(T1,{
         $:0
        });
       }
      else
       {
        v=matchValue.$0;
        _=List.ofArray([v]);
       }
      return _;
     };
     return Seq.collect(mapping,s);
    },
    collect:function(f,s)
    {
     return Seq.concat(Seq.map(f,s));
    },
    concat:function(ss)
    {
     return Enumerable.Of(function()
     {
      var outerE,next;
      outerE=Enumerator.Get(ss);
      next=function(st)
      {
       var matchValue,_,_1,_2;
       matchValue=st.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(outerE.MoveNext())
          {
           st.s=Enumerator.Get(outerE.get_Current());
           _1=next(st);
          }
         else
          {
           outerE.Dispose();
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           st.c=matchValue.get_Current();
           _2=true;
          }
         else
          {
           st.Dispose();
           st.s=null;
           _2=next(st);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next,function(st)
      {
       var x;
       x=st.s;
       !Unchecked.Equals(x,null)?x.Dispose():null;
       return!Unchecked.Equals(outerE,null)?outerE.Dispose():null;
      });
     });
    },
    delay:function(f)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(f(null));
     });
    },
    empty:function()
    {
     return[];
    },
    enumFinally:function(s,f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,_,e,dispose,next;
      try
      {
       _=Enumerator.Get(s);
      }
      catch(e)
      {
       f(null);
       _=Operators.Raise(e);
      }
      _enum=_;
      dispose=function()
      {
       _enum.Dispose();
       return f(null);
      };
      next=function(e1)
      {
       var _1;
       if(_enum.MoveNext())
        {
         e1.c=_enum.get_Current();
         _1=true;
        }
       else
        {
         _1=false;
        }
       return _1;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    enumUsing:function(x,f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,_,e,dispose,next;
      try
      {
       _=Enumerator.Get(f(x));
      }
      catch(e)
      {
       x.Dispose();
       _=Operators.Raise(e);
      }
      _enum=_;
      dispose=function()
      {
       _enum.Dispose();
       return x.Dispose();
      };
      next=function(e1)
      {
       var _1;
       if(_enum.MoveNext())
        {
         e1.c=_enum.get_Current();
         _1=true;
        }
       else
        {
         _1=false;
        }
       return _1;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    enumWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var next;
      next=function(en)
      {
       var matchValue,_,_1,_2;
       matchValue=en.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(f(null))
          {
           en.s=Enumerator.Get(s);
           _1=next(en);
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           en.c=matchValue.get_Current();
           _2=true;
          }
         else
          {
           matchValue.Dispose();
           en.s=null;
           _2=next(en);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next,function(en)
      {
       var x;
       x=en.s;
       return!Unchecked.Equals(x,null)?x.Dispose():null;
      });
     });
    },
    exists:function(p,s)
    {
     var e,_,r;
     e=Enumerator.Get(s);
     try
     {
      r=false;
      while(!r?e.MoveNext():false)
       {
        r=p(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    exists2:function(p,s1,s2)
    {
     var e1,_,e2,_1,r;
     e1=Enumerator.Get(s1);
     try
     {
      e2=Enumerator.Get(s2);
      try
      {
       r=false;
       while((!r?e1.MoveNext():false)?e2.MoveNext():false)
        {
         r=(p(e1.get_Current()))(e2.get_Current());
        }
       _1=r;
      }
      finally
      {
       e2.Dispose!=undefined?e2.Dispose():null;
      }
      _=_1;
     }
     finally
     {
      e1.Dispose!=undefined?e1.Dispose():null;
     }
     return _;
    },
    filter:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,dispose,next;
      _enum=Enumerator.Get(s);
      dispose=function()
      {
       return _enum.Dispose();
      };
      next=function(e)
      {
       var loop,c,res,_;
       loop=_enum.MoveNext();
       c=_enum.get_Current();
       res=false;
       while(loop)
        {
         if(f(c))
          {
           e.c=c;
           res=true;
           _=loop=false;
          }
         else
          {
           _=_enum.MoveNext()?c=_enum.get_Current():loop=false;
          }
        }
       return res;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    find:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFind(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindBack(p,Arrays.ofSeq(s));
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndex:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFindIndex(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndexBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindIndexBack(p,Arrays.ofSeq(s));
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,x,s)
    {
     var r,e,_;
     r=x;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        r=(f(r))(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    fold2:function(f,s,s1,s2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(s1),Arrays.ofSeq(s2));
    },
    foldBack:function(f,s,state)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(s),state);
    },
    foldBack2:function(f,s1,s2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(s1),Arrays.ofSeq(s2),s);
    },
    forall:function(p,s)
    {
     return!Seq.exists(function(x)
     {
      return!p(x);
     },s);
    },
    forall2:function(p,s1,s2)
    {
     return!Seq.exists2(function(x)
     {
      return function(y)
      {
       return!(p(x))(y);
      };
     },s1,s2);
    },
    head:function(s)
    {
     var e,_;
     e=Enumerator.Get(s);
     try
     {
      _=e.MoveNext()?e.get_Current():Seq1.insufficient();
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    indexed:function(s)
    {
     return Seq.mapi(function(a)
     {
      return function(b)
      {
       return[a,b];
      };
     },s);
    },
    init:function(n,f)
    {
     return Seq.take(n,Seq.initInfinite(f));
    },
    initInfinite:function(f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       e.c=f(e.s);
       e.s=e.s+1;
       return true;
      };
      return T.New(0,null,next,function()
      {
      });
     };
     return Enumerable.Of(getEnumerator);
    },
    isEmpty:function(s)
    {
     var e,_;
     e=Enumerator.Get(s);
     try
     {
      _=!e.MoveNext();
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    iter:function(p,s)
    {
     return Seq.iteri(function()
     {
      return function(x)
      {
       return p(x);
      };
     },s);
    },
    iter2:function(p,s1,s2)
    {
     var e1,_,e2,_1;
     e1=Enumerator.Get(s1);
     try
     {
      e2=Enumerator.Get(s2);
      try
      {
       while(e1.MoveNext()?e2.MoveNext():false)
        {
         (p(e1.get_Current()))(e2.get_Current());
        }
      }
      finally
      {
       e2.Dispose!=undefined?e2.Dispose():null;
      }
      _=_1;
     }
     finally
     {
      e1.Dispose!=undefined?e1.Dispose():null;
     }
     return _;
    },
    iteri:function(p,s)
    {
     var i,e,_;
     i=0;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        (p(i))(e.get_Current());
        i=i+1;
       }
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    iteri2:function(f,s1,s2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(s1),Arrays.ofSeq(s2));
    },
    length:function(s)
    {
     var i,e,_;
     i=0;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        i=i+1;
       }
      _=i;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    map:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,dispose,next;
      en=Enumerator.Get(s);
      dispose=function()
      {
       return en.Dispose();
      };
      next=function(e)
      {
       var _;
       if(en.MoveNext())
        {
         e.c=f(en.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    map2:function(f,s1,s2)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,dispose,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      dispose=function()
      {
       e1.Dispose();
       return e2.Dispose();
      };
      next=function(e)
      {
       var _;
       if(e1.MoveNext()?e2.MoveNext():false)
        {
         e.c=(f(e1.get_Current()))(e2.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    map3:function(f,s1,s2,s3)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,e3,dispose,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      e3=Enumerator.Get(s3);
      dispose=function()
      {
       e1.Dispose();
       e2.Dispose();
       return e3.Dispose();
      };
      next=function(e)
      {
       var _;
       if((e1.MoveNext()?e2.MoveNext():false)?e3.MoveNext():false)
        {
         e.c=((f(e1.get_Current()))(e2.get_Current()))(e3.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    mapFold:function(f,zero,s)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFold(f,zero,Seq.toArray(s));
     x=tupledArg[0];
     y=tupledArg[1];
     return[x,y];
    },
    mapFoldBack:function(f,s,zero)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFoldBack(f,Seq.toArray(s),zero);
     x=tupledArg[0];
     y=tupledArg[1];
     return[x,y];
    },
    mapi:function(f,s)
    {
     return Seq.map2(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s);
    },
    mapi2:function(f,s1,s2)
    {
     return Seq.map3(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s1,s2);
    },
    max:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)>=0?x:y;
      };
     },s);
    },
    maxBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))>=0?x:y;
      };
     },s);
    },
    min:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)<=0?x:y;
      };
     },s);
    },
    minBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))<=0?x:y;
      };
     },s);
    },
    nth:function(index,s)
    {
     var pos,e,_;
     index<0?Operators.FailWith("negative index requested"):null;
     pos=-1;
     e=Enumerator.Get(s);
     try
     {
      while(pos<index)
       {
        !e.MoveNext()?Seq1.insufficient():null;
        pos=pos+1;
       }
      _=e.get_Current();
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    permute:function(f,s)
    {
     return Seq.delay(function()
     {
      return Arrays.permute(f,Arrays.ofSeq(s));
     });
    },
    pick:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryPick(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    readOnly:function(s)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(s);
     });
    },
    reduce:function(f,source)
    {
     var e,_,r;
     e=Enumerator.Get(source);
     try
     {
      !e.MoveNext()?Operators.FailWith("The input sequence was empty"):null;
      r=e.get_Current();
      while(e.MoveNext())
       {
        r=(f(r))(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    reduceBack:function(f,s)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(s));
    },
    replicate:function(size,value)
    {
     size<0?Seq1.nonNegative():null;
     return Seq.delay(function()
     {
      return Seq.map(function()
      {
       return value;
      },Operators.range(0,size-1));
     });
    },
    rev:function(s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Seq.toArray(s).slice().reverse();
      return array;
     });
    },
    scan:function(f,x,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,dispose,next;
      en=Enumerator.Get(s);
      dispose=function()
      {
       return en.Dispose();
      };
      next=function(e)
      {
       var _,_1;
       if(e.s)
        {
         if(en.MoveNext())
          {
           e.c=(f(e.get_Current()))(en.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         e.c=x;
         e.s=true;
         _=true;
        }
       return _;
      };
      return T.New(false,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    scanBack:function(f,l,s)
    {
     return Seq.delay(function()
     {
      return Arrays.scanBack(f,Arrays.ofSeq(l),s);
     });
    },
    skip:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var _enum;
      _enum=Enumerator.Get(s);
      return T.New(true,null,function(e)
      {
       var _,i,_1;
       if(e.s)
        {
         for(i=1;i<=n;i++){
          !_enum.MoveNext()?Seq1.insufficient():null;
         }
         _=void(e.s=false);
        }
       else
        {
         _=null;
        }
       if(_enum.MoveNext())
        {
         e.c=_enum.get_Current();
         _1=true;
        }
       else
        {
         _1=false;
        }
       return _1;
      },function()
      {
       return _enum.Dispose();
      });
     });
    },
    skipWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var _enum;
      _enum=Enumerator.Get(s);
      return T.New(true,null,function(e)
      {
       var _,go,empty,_1,_2,_3;
       if(e.s)
        {
         go=true;
         empty=false;
         while(go)
          {
           if(_enum.MoveNext())
            {
             _1=!f(_enum.get_Current())?go=false:null;
            }
           else
            {
             go=false;
             _1=empty=true;
            }
          }
         e.s=false;
         if(empty)
          {
           _2=false;
          }
         else
          {
           e.c=_enum.get_Current();
           _2=true;
          }
         _=_2;
        }
       else
        {
         if(_enum.MoveNext())
          {
           e.c=_enum.get_Current();
           _3=true;
          }
         else
          {
           _3=false;
          }
         _=_3;
        }
       return _;
      },function()
      {
       return _enum.Dispose();
      });
     });
    },
    sort:function(s)
    {
     return Seq.sortBy(function(x)
     {
      return x;
     },s);
    },
    sortBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays.sortInPlaceBy(f,array);
      return array;
     });
    },
    sortByDescending:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays1.sortInPlaceByDescending(f,array);
      return array;
     });
    },
    sortDescending:function(s)
    {
     return Seq.sortByDescending(function(x)
     {
      return x;
     },s);
    },
    sortWith:function(f,s)
    {
     return Seq.delay(function()
     {
      var a;
      a=Arrays.ofSeq(s);
      Arrays.sortInPlaceWith(f,a);
      return a;
     });
    },
    splitInto:function(count,s)
    {
     count<=0?Operators.FailWith("Count must be positive"):null;
     return Seq.delay(function()
     {
      var source;
      source=Arrays1.splitInto(count,Arrays.ofSeq(s));
      return source;
     });
    },
    sum:function(s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+x;
      };
     },0,s);
    },
    sumBy:function(f,s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+f(x);
      };
     },0,s);
    },
    tail:function(s)
    {
     return Seq.skip(1,s);
    },
    take:function(n,s)
    {
     n<0?Seq1.nonNegative():null;
     return Enumerable.Of(function()
     {
      var e;
      e=[Enumerator.Get(s)];
      return T.New(0,null,function(_enum)
      {
       var _,en,_1,_2,_3;
       _enum.s=_enum.s+1;
       if(_enum.s>n)
        {
         _=false;
        }
       else
        {
         en=e[0];
         if(Unchecked.Equals(en,null))
          {
           _1=Seq1.insufficient();
          }
         else
          {
           if(en.MoveNext())
            {
             _enum.c=en.get_Current();
             if(_enum.s===n)
              {
               en.Dispose();
               _3=void(e[0]=null);
              }
             else
              {
               _3=null;
              }
             _2=true;
            }
           else
            {
             en.Dispose();
             e[0]=null;
             _2=Seq1.insufficient();
            }
           _1=_2;
          }
         _=_1;
        }
       return _;
      },function()
      {
       var x;
       x=e[0];
       return!Unchecked.Equals(x,null)?x.Dispose():null;
      });
     });
    },
    takeWhile:function(f,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?f(e.get_Current()):false;
       },Seq.delay(function()
       {
        return[e.get_Current()];
       }));
      });
     });
    },
    toArray:function(s)
    {
     var q,enumerator,_,e;
     q=[];
     enumerator=Enumerator.Get(s);
     try
     {
      while(enumerator.MoveNext())
       {
        e=enumerator.get_Current();
        q.push(e);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     return q.slice(0);
    },
    toList:function(s)
    {
     return List.ofSeq(s);
    },
    tryFind:function(ok,s)
    {
     var e,_,r,x;
     e=Enumerator.Get(s);
     try
     {
      r={
       $:0
      };
      while(r.$==0?e.MoveNext():false)
       {
        x=e.get_Current();
        ok(x)?r={
         $:1,
         $0:x
        }:null;
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    tryFindIndex:function(ok,s)
    {
     var e,_,loop,i,x;
     e=Enumerator.Get(s);
     try
     {
      loop=true;
      i=0;
      while(loop?e.MoveNext():false)
       {
        x=e.get_Current();
        ok(x)?loop=false:i=i+1;
       }
      _=loop?{
       $:0
      }:{
       $:1,
       $0:i
      };
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    tryPick:function(f,s)
    {
     var e,_,r;
     e=Enumerator.Get(s);
     try
     {
      r={
       $:0
      };
      while(Unchecked.Equals(r,{
       $:0
      })?e.MoveNext():false)
       {
        r=f(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    zip:function(s1,s2)
    {
     return Seq.map2(function(x)
     {
      return function(y)
      {
       return[x,y];
      };
     },s1,s2);
    },
    zip3:function(s1,s2,s3)
    {
     return Seq.map2(function(x)
     {
      return function(tupledArg)
      {
       var y,z;
       y=tupledArg[0];
       z=tupledArg[1];
       return[x,y,z];
      };
     },s1,Seq.zip(s2,s3));
    }
   },
   Slice:{
    array:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1=[];
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    },
    array2D:function(arr,start1,finish1,start2,finish2)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3,len1,len2;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=arr.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(arr.length?arr[0].length:0)-1;
      }
     finish21=_3;
     len1=finish11-start11+1;
     len2=finish21-start21+1;
     return Arrays.sub2D(arr,start11,start21,len1,len2);
    },
    array2Dfix1:function(arr,fixed1,start2,finish2)
    {
     var start21,_,n,finish21,_1,n1,len2,dst,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(arr.length?arr[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     dst=Array(len2);
     for(j=0;j<=len2-1;j++){
      Arrays.set(dst,j,Arrays.get2D(arr,fixed1,start21+j));
     }
     return dst;
    },
    array2Dfix2:function(arr,start1,finish1,fixed2)
    {
     var start11,_,n,finish11,_1,n1,len1,dst,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=arr.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     dst=Array(len1);
     for(i=0;i<=len1-1;i++){
      Arrays.set(dst,i,Arrays.get2D(arr,start11+i,fixed2));
     }
     return dst;
    },
    setArray:function(dst,start,finish,src)
    {
     var start1,_,n,finish1,_1,n1;
     if(start.$==1)
      {
       n=start.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start1=_;
     if(finish.$==1)
      {
       n1=finish.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish1=_1;
     return Arrays.setSub(dst,start1,finish1-start1+1,src);
    },
    setArray2D:function(dst,start1,finish1,start2,finish2,src)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=dst.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(dst.length?dst[0].length:0)-1;
      }
     finish21=_3;
     return Arrays.setSub2D(dst,start11,start21,finish11-start11+1,finish21-start21+1,src);
    },
    setArray2Dfix1:function(dst,fixed1,start2,finish2,src)
    {
     var start21,_,n,finish21,_1,n1,len2,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(dst.length?dst[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     for(j=0;j<=len2-1;j++){
      Arrays.set2D(dst,fixed1,start21+j,Arrays.get(src,j));
     }
     return;
    },
    setArray2Dfix2:function(dst,start1,finish1,fixed2,src)
    {
     var start11,_,n,finish11,_1,n1,len1,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     for(i=0;i<=len1-1;i++){
      Arrays.set2D(dst,start11+i,fixed2,Arrays.get(src,i));
     }
     return;
    },
    string:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1="";
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    }
   },
   Stack:{
    Clear:function(stack)
    {
     return stack.splice(0,Arrays.length(stack));
    },
    Contains:function(stack,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },stack);
    },
    CopyTo:function(stack,array,index)
    {
     return Arrays.blit(array,0,array,index,Arrays.length(stack));
    }
   },
   Strings:{
    Compare:function(x,y)
    {
     return Operators.Compare(x,y);
    },
    CopyTo:function(s,o,d,off,ct)
    {
     return Arrays.blit(Strings.ToCharArray(s),o,d,off,ct);
    },
    EndsWith:function($x,$s)
    {
     var $0=this,$this=this;
     return $x.substring($x.length-$s.length)==$s;
    },
    Filter:function(f,s)
    {
     var chooser,source;
     chooser=function(c)
     {
      return f(c)?{
       $:1,
       $0:String.fromCharCode(c)
      }:{
       $:0
      };
     };
     source=Seq.choose(chooser,s);
     return Arrays.ofSeq(source).join("");
    },
    IndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.indexOf(Global.String.fromCharCode($c),$i);
    },
    Insert:function($x,$index,$s)
    {
     var $0=this,$this=this;
     return $x.substring(0,$index-1)+$s+$x.substring($index);
    },
    IsNullOrEmpty:function($x)
    {
     var $0=this,$this=this;
     return $x==null||$x=="";
    },
    IsNullOrWhiteSpace:function($x)
    {
     var $0=this,$this=this;
     return $x==null||(/^\s*$/).test($x);
    },
    Join:function($sep,$values)
    {
     var $0=this,$this=this;
     return $values.join($sep);
    },
    LastIndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.lastIndexOf(Global.String.fromCharCode($c),$i);
    },
    PadLeft:function(s,n)
    {
     return Strings.PadLeftWith(s,n,32);
    },
    PadLeftWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $n>$s.length?Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c))+$s:$s;
    },
    PadRight:function(s,n)
    {
     return Strings.PadRightWith(s,n,32);
    },
    PadRightWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $n>$s.length?$s+Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c)):$s;
    },
    RegexEscape:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");
    },
    Remove:function($x,$ix,$ct)
    {
     var $0=this,$this=this;
     return $x.substring(0,$ix)+$x.substring($ix+$ct);
    },
    Replace:function(subject,search,replace)
    {
     var replaceLoop;
     replaceLoop=function(subj)
     {
      var index,_,replaced,nextStartIndex;
      index=subj.indexOf(search);
      if(index!==-1)
       {
        replaced=Strings.ReplaceOnce(subj,search,replace);
        nextStartIndex=index+replace.length;
        _=Strings.Substring(replaced,0,index+replace.length)+replaceLoop(replaced.substring(nextStartIndex));
       }
      else
       {
        _=subj;
       }
      return _;
     };
     return replaceLoop(subject);
    },
    ReplaceChar:function(s,oldC,newC)
    {
     return Strings.Replace(s,String.fromCharCode(oldC),String.fromCharCode(newC));
    },
    ReplaceOnce:function($string,$search,$replace)
    {
     var $0=this,$this=this;
     return $string.replace($search,$replace);
    },
    Split:function(s,pat,opts)
    {
     var res;
     res=Strings.SplitWith(s,pat);
     return opts===1?Arrays.filter(function(x)
     {
      return x!=="";
     },res):res;
    },
    SplitChars:function(s,sep,opts)
    {
     var re;
     re="["+Strings.RegexEscape(String.fromCharCode.apply(undefined,sep))+"]";
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitStrings:function(s,sep,opts)
    {
     var re;
     re=Strings.concat("|",Arrays.map(function(s1)
     {
      return Strings.RegexEscape(s1);
     },sep));
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitWith:function($str,$pat)
    {
     var $0=this,$this=this;
     return $str.split($pat);
    },
    StartsWith:function($t,$s)
    {
     var $0=this,$this=this;
     return $t.substring(0,$s.length)==$s;
    },
    Substring:function($s,$ix,$ct)
    {
     var $0=this,$this=this;
     return $s.substr($ix,$ct);
    },
    ToCharArray:function(s)
    {
     return Arrays.init(s.length,function(x)
     {
      return s.charCodeAt(x);
     });
    },
    ToCharArrayRange:function(s,startIndex,length)
    {
     return Arrays.init(length,function(i)
     {
      return s.charCodeAt(startIndex+i);
     });
    },
    Trim:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"").replace(/\s+$/,"");
    },
    TrimEnd:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/\s+$/,"");
    },
    TrimStart:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"");
    },
    collect:function(f,s)
    {
     return Arrays.init(s.length,function(i)
     {
      return f(s.charCodeAt(i));
     }).join("");
    },
    concat:function(separator,strings)
    {
     return Seq.toArray(strings).join(separator);
    },
    exists:function(f,s)
    {
     return Seq.exists(f,Strings.protect(s));
    },
    forall:function(f,s)
    {
     return Seq.forall(f,Strings.protect(s));
    },
    init:function(count,f)
    {
     return Arrays.init(count,f).join("");
    },
    iter:function(f,s)
    {
     return Seq.iter(f,Strings.protect(s));
    },
    iteri:function(f,s)
    {
     return Seq.iteri(f,Strings.protect(s));
    },
    length:function(s)
    {
     return Strings.protect(s).length;
    },
    map:function(f,s)
    {
     return Strings.collect(function(x)
     {
      return String.fromCharCode(f(x));
     },Strings.protect(s));
    },
    mapi:function(f,s)
    {
     return Seq.toArray(Seq.mapi(function(i)
     {
      return function(x)
      {
       return String.fromCharCode((f(i))(x));
      };
     },s)).join("");
    },
    protect:function(s)
    {
     return s===null?"":s;
    },
    replicate:function(count,s)
    {
     return Strings.init(count,function()
     {
      return s;
     });
    }
   },
   TimeoutException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,TimeoutException.New1("The operation has timed out."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Unchecked:{
    Compare:function(a,b)
    {
     var objCompare,_2,matchValue,_3,matchValue1;
     objCompare=function(a1)
     {
      return function(b1)
      {
       var cmp;
       cmp=[0];
       JSModule.ForEach(a1,function(k)
       {
        var _,_1;
        if(!a1.hasOwnProperty(k))
         {
          _=false;
         }
        else
         {
          if(!b1.hasOwnProperty(k))
           {
            cmp[0]=1;
            _1=true;
           }
          else
           {
            cmp[0]=Unchecked.Compare(a1[k],b1[k]);
            _1=cmp[0]!==0;
           }
          _=_1;
         }
        return _;
       });
       cmp[0]===0?JSModule.ForEach(b1,function(k)
       {
        var _,_1;
        if(!b1.hasOwnProperty(k))
         {
          _=false;
         }
        else
         {
          if(!a1.hasOwnProperty(k))
           {
            cmp[0]=-1;
            _1=true;
           }
          else
           {
            _1=false;
           }
          _=_1;
         }
        return _;
       }):null;
       return cmp[0];
      };
     };
     if(a===b)
      {
       _2=0;
      }
     else
      {
       matchValue=typeof a;
       if(matchValue==="function")
        {
         _3=Operators.FailWith("Cannot compare function values.");
        }
       else
        {
         if(matchValue==="boolean")
          {
           _3=a<b?-1:1;
          }
         else
          {
           if(matchValue==="number")
            {
             _3=a<b?-1:1;
            }
           else
            {
             if(matchValue==="string")
              {
               _3=a<b?-1:1;
              }
             else
              {
               if(matchValue==="object")
                {
                 _3=a===null?-1:b===null?1:"CompareTo"in a?a.CompareTo(b):(a instanceof Array?b instanceof Array:false)?Unchecked.compareArrays(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.compareDates(a,b):(objCompare(a))(b);
                }
               else
                {
                 matchValue1=typeof b;
                 _3=matchValue1==="undefined"?0:-1;
                }
              }
            }
          }
        }
       _2=_3;
      }
     return _2;
    },
    Equals:function(a,b)
    {
     var objEquals,_,matchValue;
     objEquals=function(a1)
     {
      return function(b1)
      {
       var eqR;
       eqR=[true];
       JSModule.ForEach(a1,function(k)
       {
        eqR[0]=!a1.hasOwnProperty(k)?true:b1.hasOwnProperty(k)?Unchecked.Equals(a1[k],b1[k]):false;
        return!eqR[0];
       });
       eqR[0]?JSModule.ForEach(b1,function(k)
       {
        eqR[0]=!b1.hasOwnProperty(k)?true:a1.hasOwnProperty(k);
        return!eqR[0];
       }):null;
       return eqR[0];
      };
     };
     if(a===b)
      {
       _=true;
      }
     else
      {
       matchValue=typeof a;
       _=matchValue==="object"?(((a===null?true:a===undefined)?true:b===null)?true:b===undefined)?false:"Equals"in a?a.Equals(b):(a instanceof Array?b instanceof Array:false)?Unchecked.arrayEquals(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.dateEquals(a,b):(objEquals(a))(b):false;
      }
     return _;
    },
    Hash:function(o)
    {
     var matchValue;
     matchValue=typeof o;
     return matchValue==="function"?0:matchValue==="boolean"?o?1:0:matchValue==="number"?o:matchValue==="string"?Unchecked.hashString(o):matchValue==="object"?o==null?0:o instanceof Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
    },
    arrayEquals:function(a,b)
    {
     var _,eq,i;
     if(Arrays.length(a)===Arrays.length(b))
      {
       eq=true;
       i=0;
       while(eq?i<Arrays.length(a):false)
        {
         !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?eq=false:null;
         i=i+1;
        }
       _=eq;
      }
     else
      {
       _=false;
      }
     return _;
    },
    compareArrays:function(a,b)
    {
     var _,_1,cmp,i;
     if(Arrays.length(a)<Arrays.length(b))
      {
       _=-1;
      }
     else
      {
       if(Arrays.length(a)>Arrays.length(b))
        {
         _1=1;
        }
       else
        {
         cmp=0;
         i=0;
         while(cmp===0?i<Arrays.length(a):false)
          {
           cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
           i=i+1;
          }
         _1=cmp;
        }
       _=_1;
      }
     return _;
    },
    compareDates:function(a,b)
    {
     return Operators.Compare(a.getTime(),b.getTime());
    },
    dateEquals:function(a,b)
    {
     return a.getTime()===b.getTime();
    },
    hashArray:function(o)
    {
     var h,i;
     h=-34948909;
     for(i=0;i<=Arrays.length(o)-1;i++){
      h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
     }
     return h;
    },
    hashMix:function(x,y)
    {
     return(x<<5)+x+y;
    },
    hashObject:function(o)
    {
     var _,op_PlusPlus,h;
     if("GetHashCode"in o)
      {
       _=o.GetHashCode();
      }
     else
      {
       op_PlusPlus=function(x,y)
       {
        return Unchecked.hashMix(x,y);
       };
       h=[0];
       JSModule.ForEach(o,function(key)
       {
        h[0]=op_PlusPlus(op_PlusPlus(h[0],Unchecked.hashString(key)),Unchecked.Hash(o[key]));
        return false;
       });
       _=h[0];
      }
     return _;
    },
    hashString:function(s)
    {
     var _,hash,i;
     if(s===null)
      {
       _=0;
      }
     else
      {
       hash=5381;
       for(i=0;i<=s.length-1;i++){
        hash=Unchecked.hashMix(hash,s.charCodeAt(i)<<0);
       }
       _=hash;
      }
     return _;
    }
   },
   Util:{
    addListener:function(event,h)
    {
     event.Subscribe(Util.observer(h));
    },
    observer:function(h)
    {
     return{
      OnCompleted:function()
      {
      },
      OnError:function()
      {
      },
      OnNext:h
     };
    },
    subscribeTo:function(event,h)
    {
     return event.Subscribe(Util.observer(h));
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Array=Runtime.Safe(Global.Array);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  List=Runtime.Safe(Global.WebSharper.List);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  T=Runtime.Safe(Enumerator.T);
  Enumerable=Runtime.Safe(Global.WebSharper.Enumerable);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Seq1=Runtime.Safe(Global.Seq);
  Arrays1=Runtime.Safe(Global.Arrays);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Activator=Runtime.Safe(Global.WebSharper.Activator);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Json=Runtime.Safe(Global.WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  AggregateException=Runtime.Safe(Global.WebSharper.AggregateException);
  Exception=Runtime.Safe(Global.WebSharper.Exception);
  ArgumentException=Runtime.Safe(Global.WebSharper.ArgumentException);
  Number=Runtime.Safe(Global.Number);
  IndexOutOfRangeException=Runtime.Safe(Global.WebSharper.IndexOutOfRangeException);
  List1=Runtime.Safe(Global.List);
  Arrays2D=Runtime.Safe(Global.WebSharper.Arrays2D);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Option=Runtime.Safe(Global.WebSharper.Option);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  setTimeout=Runtime.Safe(Global.setTimeout);
  CancellationTokenSource=Runtime.Safe(Global.WebSharper.CancellationTokenSource);
  Char=Runtime.Safe(Global.WebSharper.Char);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  OperationCanceledException=Runtime.Safe(Global.WebSharper.OperationCanceledException);
  Date=Runtime.Safe(Global.Date);
  console=Runtime.Safe(Global.console);
  TimeoutException=Runtime.Safe(Global.WebSharper.TimeoutException);
  Scheduler=Runtime.Safe(Concurrency.Scheduler);
  HtmlContentExtensions=Runtime.Safe(Global.WebSharper.HtmlContentExtensions);
  SingleNode=Runtime.Safe(HtmlContentExtensions.SingleNode);
  InvalidOperationException=Runtime.Safe(Global.WebSharper.InvalidOperationException);
  T1=Runtime.Safe(List.T);
  MatchFailureException=Runtime.Safe(Global.WebSharper.MatchFailureException);
  Math=Runtime.Safe(Global.Math);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  PrintfHelpers=Runtime.Safe(Global.WebSharper.PrintfHelpers);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  XhrProvider=Runtime.Safe(Remoting.XhrProvider);
  AsyncProxy=Runtime.Safe(Global.WebSharper.AsyncProxy);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  window=Runtime.Safe(Global.window);
  String=Runtime.Safe(Global.String);
  return RegExp=Runtime.Safe(Global.RegExp);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(AggregateException,Exception);
  Runtime.Inherit(ArgumentException,Exception);
  Runtime.Inherit(IndexOutOfRangeException,Exception);
  Runtime.Inherit(InvalidOperationException,Exception);
  Runtime.Inherit(MatchFailureException,Exception);
  Runtime.Inherit(OperationCanceledException,Exception);
  Runtime.Inherit(TimeoutException,Exception);
  Remoting.EndPoint();
  Remoting.AjaxProvider();
  Concurrency.scheduler();
  Concurrency.defCTS();
  Concurrency.GetCT();
  Activator.Activate();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Collections,BalancedTree,Operators,Arrays,Seq,List,T,Seq1,JavaScript,JSModule,Enumerator,DictionaryUtil,Dictionary,Unchecked,FSharpMap,Pair,Option,MapUtil,FSharpSet,SetModule,SetUtil,Array,HashSetUtil,HashSetProxy,LinkedList,E,T1,ResizeArray,ResizeArrayProxy;
 Runtime.Define(Global,{
  WebSharper:{
   Collections:{
    BalancedTree:{
     Add:function(x,t)
     {
      return BalancedTree.Put(function()
      {
       return function(x1)
       {
        return x1;
       };
      },x,t);
     },
     Branch:function(node,left,right)
     {
      return{
       Node:node,
       Left:left,
       Right:right,
       Height:1+Operators.Max(left==null?0:left.Height,right==null?0:right.Height),
       Count:1+(left==null?0:left.Count)+(right==null?0:right.Count)
      };
     },
     Build:function(data,min,max)
     {
      var sz,_,center,left,right;
      sz=max-min+1;
      if(sz<=0)
       {
        _=null;
       }
      else
       {
        center=(min+max)/2>>0;
        left=BalancedTree.Build(data,min,center-1);
        right=BalancedTree.Build(data,center+1,max);
        _=BalancedTree.Branch(Arrays.get(data,center),left,right);
       }
      return _;
     },
     Contains:function(v,t)
     {
      return!((BalancedTree.Lookup(v,t))[0]==null);
     },
     Enumerate:function(flip,t)
     {
      var gen;
      gen=function(tupledArg)
      {
       var t1,spine,_,_1,t2,spine1,other;
       t1=tupledArg[0];
       spine=tupledArg[1];
       if(t1==null)
        {
         if(spine.$==1)
          {
           t2=spine.$0[0];
           spine1=spine.$1;
           other=spine.$0[1];
           _1={
            $:1,
            $0:[t2,[other,spine1]]
           };
          }
         else
          {
           _1={
            $:0
           };
          }
         _=_1;
        }
       else
        {
         _=flip?gen([t1.Right,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Left],
          $1:spine
         })]):gen([t1.Left,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Right],
          $1:spine
         })]);
        }
       return _;
      };
      return Seq.unfold(gen,[t,Runtime.New(T,{
       $:0
      })]);
     },
     Lookup:function(k,t)
     {
      var spine,t1,loop,_,matchValue,_1;
      spine=[];
      t1=t;
      loop=true;
      while(loop)
       {
        if(t1==null)
         {
          _=loop=false;
         }
        else
         {
          matchValue=Operators.Compare(k,t1.Node);
          if(matchValue===0)
           {
            _1=loop=false;
           }
          else
           {
            if(matchValue===1)
             {
              spine.unshift([true,t1.Node,t1.Left]);
              _1=t1=t1.Right;
             }
            else
             {
              spine.unshift([false,t1.Node,t1.Right]);
              _1=t1=t1.Left;
             }
           }
          _=_1;
         }
       }
      return[t1,spine];
     },
     OfSeq:function(data)
     {
      var data1;
      data1=Arrays.sort(Seq1.toArray(Seq.distinct(data)));
      return BalancedTree.Build(data1,0,data1.length-1);
     },
     Put:function(combine,k,t)
     {
      var patternInput,t1,spine;
      patternInput=BalancedTree.Lookup(k,t);
      t1=patternInput[0];
      spine=patternInput[1];
      return t1==null?BalancedTree.Rebuild(spine,BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(spine,BalancedTree.Branch((combine(t1.Node))(k),t1.Left,t1.Right));
     },
     Rebuild:function(spine,t)
     {
      var h,t1,i,matchValue,_,x1,l,_1,_2,m,x2,r,_3,_4,m1;
      h=function(x)
      {
       return x==null?0:x.Height;
      };
      t1=t;
      for(i=0;i<=Arrays.length(spine)-1;i++){
       matchValue=Arrays.get(spine,i);
       if(matchValue[0])
        {
         x1=matchValue[1];
         l=matchValue[2];
         if(h(t1)>h(l)+1)
          {
           if(h(t1.Left)===h(t1.Right)+1)
            {
             m=t1.Left;
             _2=BalancedTree.Branch(m.Node,BalancedTree.Branch(x1,l,m.Left),BalancedTree.Branch(t1.Node,m.Right,t1.Right));
            }
           else
            {
             _2=BalancedTree.Branch(t1.Node,BalancedTree.Branch(x1,l,t1.Left),t1.Right);
            }
           _1=_2;
          }
         else
          {
           _1=BalancedTree.Branch(x1,l,t1);
          }
         _=_1;
        }
       else
        {
         x2=matchValue[1];
         r=matchValue[2];
         if(h(t1)>h(r)+1)
          {
           if(h(t1.Right)===h(t1.Left)+1)
            {
             m1=t1.Right;
             _4=BalancedTree.Branch(m1.Node,BalancedTree.Branch(t1.Node,t1.Left,m1.Left),BalancedTree.Branch(x2,m1.Right,r));
            }
           else
            {
             _4=BalancedTree.Branch(t1.Node,t1.Left,BalancedTree.Branch(x2,t1.Right,r));
            }
           _3=_4;
          }
         else
          {
           _3=BalancedTree.Branch(x2,t1,r);
          }
         _=_3;
        }
       t1=_;
      }
      return t1;
     },
     Remove:function(k,src)
     {
      var patternInput,t,spine,_,_1,_2,source,data,t1;
      patternInput=BalancedTree.Lookup(k,src);
      t=patternInput[0];
      spine=patternInput[1];
      if(t==null)
       {
        _=src;
       }
      else
       {
        if(t.Right==null)
         {
          _1=BalancedTree.Rebuild(spine,t.Left);
         }
        else
         {
          if(t.Left==null)
           {
            _2=BalancedTree.Rebuild(spine,t.Right);
           }
          else
           {
            source=Seq1.append(BalancedTree.Enumerate(false,t.Left),BalancedTree.Enumerate(false,t.Right));
            data=Seq1.toArray(source);
            t1=BalancedTree.Build(data,0,data.length-1);
            _2=BalancedTree.Rebuild(spine,t1);
           }
          _1=_2;
         }
        _=_1;
       }
      return _;
     },
     TryFind:function(v,t)
     {
      var x;
      x=(BalancedTree.Lookup(v,t))[0];
      return x==null?{
       $:0
      }:{
       $:1,
       $0:x.Node
      };
     }
    },
    Dictionary:Runtime.Class({
     Add:function(k,v)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        _=Operators.FailWith("An item with the same key has already been added.");
       }
      else
       {
        this.data[h]={
         K:k,
         V:v
        };
        _=void(this.count=this.count+1);
       }
      return _;
     },
     Clear:function()
     {
      this.data={};
      this.count=0;
      return;
     },
     ContainsKey:function(k)
     {
      return this.data.hasOwnProperty(this.hash.call(null,k));
     },
     GetEnumerator:function()
     {
      var s;
      s=JSModule.GetFieldValues(this.data);
      return Enumerator.Get(s);
     },
     Remove:function(k)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        JSModule.Delete(this.data,h);
        this.count=this.count-1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },
     get_Item:function(k)
     {
      var k1,_,x;
      k1=this.hash.call(null,k);
      if(this.data.hasOwnProperty(k1))
       {
        x=this.data[k1];
        _=x.V;
       }
      else
       {
        _=DictionaryUtil.notPresent();
       }
      return _;
     },
     set_Item:function(k,v)
     {
      var h;
      h=this.hash.call(null,k);
      !this.data.hasOwnProperty(h)?void(this.count=this.count+1):null;
      this.data[h]={
       K:k,
       V:v
      };
      return;
     }
    },{
     New:function(dictionary)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(dictionary,comparer)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function(capacity,comparer)
     {
      return Runtime.New(this,Dictionary.New3(comparer));
     },
     New12:function()
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function()
     {
      return Runtime.New(this,Dictionary.New12());
     },
     New3:function(comparer)
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New4:function(init,equals,hash)
     {
      var r,enumerator,_,x,x1;
      r=Runtime.New(this,{});
      r.hash=hash;
      r.count=0;
      r.data={};
      enumerator=Enumerator.Get(init);
      try
      {
       while(enumerator.MoveNext())
        {
         x=enumerator.get_Current();
         x1=x.K;
         r.data[r.hash.call(null,x1)]=x.V;
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return r;
     }
    }),
    DictionaryUtil:{
     notPresent:function()
     {
      return Operators.FailWith("The given key was not present in the dictionary.");
     }
    },
    FSharpMap:Runtime.Class({
     Add:function(k,v)
     {
      var x,x1;
      x=this.tree;
      x1=Runtime.New(Pair,{
       Key:k,
       Value:v
      });
      return FSharpMap.New(BalancedTree.Add(x1,x));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(x)
      {
       return function(y)
       {
        return Operators.Compare(x,y);
       };
      },this,other);
     },
     ContainsKey:function(k)
     {
      var x,v;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return BalancedTree.Contains(v,x);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq1.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      var mapping,source,s;
      mapping=function(kv)
      {
       return{
        K:kv.Key,
        V:kv.Value
       };
      };
      source=BalancedTree.Enumerate(false,this.tree);
      s=Seq1.map(mapping,source);
      return Enumerator.Get(s);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(Seq1.toArray(this));
     },
     Remove:function(k)
     {
      var x,k1;
      x=this.tree;
      k1=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return FSharpMap.New(BalancedTree.Remove(k1,x));
     },
     TryFind:function(k)
     {
      var x,v,mapping,option;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      mapping=function(kv)
      {
       return kv.Value;
      };
      option=BalancedTree.TryFind(v,x);
      return Option.map(mapping,option);
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_Item:function(k)
     {
      var matchValue,_,v;
      matchValue=this.TryFind(k);
      if(matchValue.$==0)
       {
        _=Operators.FailWith("The given key was not present in the dictionary.");
       }
      else
       {
        v=matchValue.$0;
        _=v;
       }
      return _;
     },
     get_Tree:function()
     {
      return this.tree;
     }
    },{
     New:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     },
     New1:function(s)
     {
      return Runtime.New(this,FSharpMap.New(MapUtil.fromSeq(s)));
     }
    }),
    FSharpSet:Runtime.Class({
     Add:function(x)
     {
      return FSharpSet.New1(BalancedTree.Add(x,this.tree));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(e1)
      {
       return function(e2)
       {
        return Operators.Compare(e1,e2);
       };
      },this,other);
     },
     Contains:function(v)
     {
      return BalancedTree.Contains(v,this.tree);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq1.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(BalancedTree.Enumerate(false,this.tree));
     },
     GetHashCode:function()
     {
      return-1741749453+Unchecked.Hash(Seq1.toArray(this));
     },
     IsProperSubsetOf:function(s)
     {
      return this.IsSubsetOf(s)?this.get_Count()<s.get_Count():false;
     },
     IsProperSupersetOf:function(s)
     {
      return this.IsSupersetOf(s)?this.get_Count()>s.get_Count():false;
     },
     IsSubsetOf:function(s)
     {
      return Seq1.forall(function(arg00)
      {
       return s.Contains(arg00);
      },this);
     },
     IsSupersetOf:function(s)
     {
      var _this=this;
      return Seq1.forall(function(arg00)
      {
       return _this.Contains(arg00);
      },s);
     },
     Remove:function(v)
     {
      return FSharpSet.New1(BalancedTree.Remove(v,this.tree));
     },
     add:function(x)
     {
      return FSharpSet.New1(BalancedTree.OfSeq(Seq1.append(this,x)));
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_MaximumElement:function()
     {
      return Seq1.head(BalancedTree.Enumerate(true,this.tree));
     },
     get_MinimumElement:function()
     {
      return Seq1.head(BalancedTree.Enumerate(false,this.tree));
     },
     get_Tree:function()
     {
      return this.tree;
     },
     sub:function(x)
     {
      return SetModule.Filter(function(x1)
      {
       return!x.Contains(x1);
      },this);
     }
    },{
     New:function(s)
     {
      return Runtime.New(this,FSharpSet.New1(SetUtil.ofSeq(s)));
     },
     New1:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     }
    }),
    HashSetProxy:Runtime.Class({
     Add:function(item)
     {
      return this.add(item);
     },
     Clear:function()
     {
      this.data=Array.prototype.constructor.apply(Array,[]);
      this.count=0;
      return;
     },
     Contains:function(item)
     {
      var arr;
      arr=this.data[this.hash.call(null,item)];
      return arr==null?false:this.arrContains(item,arr);
     },
     CopyTo:function(arr)
     {
      var i,all,i1;
      i=0;
      all=HashSetUtil.concat(this.data);
      for(i1=0;i1<=all.length-1;i1++){
       Arrays.set(arr,i1,all[i1]);
      }
      return;
     },
     ExceptWith:function(xs)
     {
      var enumerator,_,item,value;
      enumerator=Enumerator.Get(xs);
      try
      {
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         value=this.Remove(item);
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(HashSetUtil.concat(this.data));
     },
     IntersectWith:function(xs)
     {
      var other,all,i,item,value,_,value1;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       value=other.Contains(item);
       if(!value)
        {
         value1=this.Remove(item);
         _=void value1;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     IsProperSubsetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count<Arrays.length(other)?this.IsSubsetOf(other):false;
     },
     IsProperSupersetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count>Arrays.length(other)?this.IsSupersetOf(other):false;
     },
     IsSubsetOf:function(xs)
     {
      var other,predicate,array;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      predicate=function(arg00)
      {
       return other.Contains(arg00);
      };
      array=HashSetUtil.concat(this.data);
      return Seq1.forall(predicate,array);
     },
     IsSupersetOf:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq1.forall(predicate,xs);
     },
     Overlaps:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq1.exists(predicate,xs);
     },
     Remove:function(item)
     {
      var h,arr,_,_1;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        _=false;
       }
      else
       {
        if(this.arrRemove(item,arr))
         {
          this.count=this.count-1;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      return _;
     },
     RemoveWhere:function(cond)
     {
      var all,i,item,_,value;
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       if(cond(item))
        {
         value=this.Remove(item);
         _=void value;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     SetEquals:function(xs)
     {
      var other;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      return this.get_Count()===other.get_Count()?this.IsSupersetOf(other):false;
     },
     SymmetricExceptWith:function(xs)
     {
      var enumerator,_,item,_1,value,value1;
      enumerator=Enumerator.Get(xs);
      try
      {
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         if(this.Contains(item))
          {
           value=this.Remove(item);
           _1=void value;
          }
         else
          {
           value1=this.Add(item);
           _1=void value1;
          }
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     },
     UnionWith:function(xs)
     {
      var enumerator,_,item,value;
      enumerator=Enumerator.Get(xs);
      try
      {
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         value=this.Add(item);
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     },
     add:function(item)
     {
      var h,arr,_,_1,value;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        this.data[h]=[item];
        this.count=this.count+1;
        _=true;
       }
      else
       {
        if(this.arrContains(item,arr))
         {
          _1=false;
         }
        else
         {
          value=arr.push(item);
          this.count=this.count+1;
          _1=true;
         }
        _=_1;
       }
      return _;
     },
     arrContains:function(item,arr)
     {
      var c,i,l;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        (this.equals.call(null,arr[i]))(item)?c=false:i=i+1;
       }
      return!c;
     },
     arrRemove:function(item,arr)
     {
      var c,i,l,_,start,ps,value;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        if((this.equals.call(null,arr[i]))(item))
         {
          start=i;
          ps=[];
          value=arr.splice.apply(arr,[start,1].concat(ps));
          _=c=false;
         }
        else
         {
          _=i=i+1;
         }
       }
      return!c;
     },
     get_Count:function()
     {
      return this.count;
     }
    },{
     New:function(init)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(Seq1.empty(),function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function()
     {
      return Runtime.New(this,HashSetProxy.New3(Seq1.empty(),function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function(init,comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New3:function(init,equals,hash)
     {
      var r,enumerator,_,x,value;
      r=Runtime.New(this,{});
      r.equals=equals;
      r.hash=hash;
      r.data=Array.prototype.constructor.apply(Array,[]);
      r.count=0;
      enumerator=Enumerator.Get(init);
      try
      {
       while(enumerator.MoveNext())
        {
         x=enumerator.get_Current();
         value=r.add(x);
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return r;
     }
    }),
    HashSetUtil:{
     concat:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o){
       r.push.apply(r,$o[k]);
      }
      ;
      return r;
     }
    },
    LinkedList:{
     E:Runtime.Class({
      Dispose:function()
      {
       return null;
      },
      MoveNext:function()
      {
       this.c=this.c.n;
       return!Unchecked.Equals(this.c,null);
      },
      get_Current:function()
      {
       return this.c.v;
      }
     },{
      New:function(l)
      {
       var r;
       r=Runtime.New(this,{});
       r.c=l;
       return r;
      }
     }),
     T:Runtime.Class({
      AddAfter:function(after,value)
      {
       var before,node,_;
       before=after.n;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(after.n,null)?void(this.p=node):null;
       after.n=node;
       if(!Unchecked.Equals(before,null))
        {
         before.p=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddBefore:function(before,value)
      {
       var after,node,_;
       after=before.p;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(before.p,null)?void(this.n=node):null;
       before.p=node;
       if(!Unchecked.Equals(after,null))
        {
         after.n=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddFirst:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddBefore(this.n,value);
        }
       return _;
      },
      AddLast:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddAfter(this.p,value);
        }
       return _;
      },
      Clear:function()
      {
       this.c=0;
       this.n=null;
       this.p=null;
       return;
      },
      Contains:function(value)
      {
       var found,node;
       found=false;
       node=this.n;
       while(!Unchecked.Equals(node,null)?!found:false)
        {
         node.v==value?found=true:node=node.n;
        }
       return found;
      },
      Find:function(value)
      {
       var node,notFound;
       node=this.n;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.n;
        }
       return notFound?null:node;
      },
      FindLast:function(value)
      {
       var node,notFound;
       node=this.p;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.p;
        }
       return notFound?null:node;
      },
      GetEnumerator:function()
      {
       return E.New(this);
      },
      Remove:function(node)
      {
       var before,after,_,_1;
       before=node.p;
       after=node.n;
       if(Unchecked.Equals(before,null))
        {
         _=void(this.n=after);
        }
       else
        {
         before.n=after;
         _=after;
        }
       if(Unchecked.Equals(after,null))
        {
         _1=void(this.p=before);
        }
       else
        {
         after.p=before;
         _1=before;
        }
       this.c=this.c-1;
       return;
      },
      Remove1:function(value)
      {
       var node,_;
       node=this.Find(value);
       if(Unchecked.Equals(node,null))
        {
         _=false;
        }
       else
        {
         this.Remove(node);
         _=true;
        }
       return _;
      },
      RemoveFirst:function()
      {
       return this.Remove(this.n);
      },
      RemoveLast:function()
      {
       return this.Remove(this.p);
      },
      get_Count:function()
      {
       return this.c;
      },
      get_First:function()
      {
       return this.n;
      },
      get_Last:function()
      {
       return this.p;
      }
     },{
      New:function()
      {
       return Runtime.New(this,T1.New1(Seq1.empty()));
      },
      New1:function(coll)
      {
       var r,ie,_,node;
       r=Runtime.New(this,{});
       r.c=0;
       r.n=null;
       r.p=null;
       ie=Enumerator.Get(coll);
       if(ie.MoveNext())
        {
         r.n={
          p:null,
          n:null,
          v:ie.get_Current()
         };
         r.p=r.n;
         _=void(r.c=1);
        }
       else
        {
         _=null;
        }
       while(ie.MoveNext())
        {
         node={
          p:r.p,
          n:null,
          v:ie.get_Current()
         };
         r.p.n=node;
         r.p=node;
         r.c=r.c+1;
        }
       return r;
      }
     })
    },
    MapModule:{
     Exists:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.exists(predicate,m);
     },
     Filter:function(f,m)
     {
      var predicate,source,source1,data,t;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      source1=Seq1.filter(predicate,source);
      data=Seq1.toArray(source1);
      t=BalancedTree.Build(data,0,data.length-1);
      return FSharpMap.New(t);
     },
     FindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq1.pick(chooser,m);
     },
     Fold:function(f,s,m)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(s1))(kv.Key))(kv.Value);
       };
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq1.fold(folder,s,source);
     },
     FoldBack:function(f,m,s)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(kv.Key))(kv.Value))(s1);
       };
      };
      source=BalancedTree.Enumerate(true,m.get_Tree());
      return Seq1.fold(folder,s,source);
     },
     ForAll:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.forall(predicate,m);
     },
     Iterate:function(f,m)
     {
      var action;
      action=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.iter(action,m);
     },
     Map:function(f,m)
     {
      var mapping,source,data,t;
      mapping=function(kv)
      {
       return Runtime.New(Pair,{
        Key:kv.Key,
        Value:(f(kv.Key))(kv.Value)
       });
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      data=Seq1.map(mapping,source);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     OfArray:function(a)
     {
      var mapping,data,t;
      mapping=function(tupledArg)
      {
       var k,v;
       k=tupledArg[0];
       v=tupledArg[1];
       return Runtime.New(Pair,{
        Key:k,
        Value:v
       });
      };
      data=Seq1.map(mapping,a);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     Partition:function(f,m)
     {
      var predicate,array,patternInput,y,x;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      array=Seq1.toArray(BalancedTree.Enumerate(false,m.get_Tree()));
      patternInput=Arrays.partition(predicate,array);
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpMap.New(BalancedTree.Build(x,0,x.length-1)),FSharpMap.New(BalancedTree.Build(y,0,y.length-1))];
     },
     Pick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.pick(chooser,m);
     },
     ToSeq:function(m)
     {
      var mapping,source;
      mapping=function(kv)
      {
       return[kv.Key,kv.Value];
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq1.map(mapping,source);
     },
     TryFind:function(k,m)
     {
      return m.TryFind(k);
     },
     TryFindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq1.tryPick(chooser,m);
     },
     TryPick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.tryPick(chooser,m);
     }
    },
    MapUtil:{
     fromSeq:function(s)
     {
      var a;
      a=Seq1.toArray(Seq1.delay(function()
      {
       return Seq1.collect(function(matchValue)
       {
        var v,k;
        v=matchValue[1];
        k=matchValue[0];
        return[Runtime.New(Pair,{
         Key:k,
         Value:v
        })];
       },Seq.distinctBy(function(tuple)
       {
        return tuple[0];
       },s));
      }));
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    },
    Pair:Runtime.Class({
     CompareTo:function(other)
     {
      return Operators.Compare(this.Key,other.Key);
     },
     Equals:function(other)
     {
      return Unchecked.Equals(this.Key,other.Key);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(this.Key);
     }
    }),
    ResizeArray:{
     ResizeArrayProxy:Runtime.Class({
      Add:function(x)
      {
       return this.arr.push(x);
      },
      AddRange:function(x)
      {
       var _this=this;
       return Seq1.iter(function(arg00)
       {
        return _this.Add(arg00);
       },x);
      },
      Clear:function()
      {
       var value;
       value=ResizeArray.splice(this.arr,0,Arrays.length(this.arr),[]);
       return;
      },
      CopyTo:function(arr)
      {
       return this.CopyTo1(arr,0);
      },
      CopyTo1:function(arr,offset)
      {
       return this.CopyTo2(0,arr,offset,this.get_Count());
      },
      CopyTo2:function(index,target,offset,count)
      {
       return Arrays.blit(this.arr,index,target,offset,count);
      },
      GetEnumerator:function()
      {
       return Enumerator.Get(this.arr);
      },
      GetRange:function(index,count)
      {
       return ResizeArrayProxy.New11(Arrays.sub(this.arr,index,count));
      },
      Insert:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,[items]);
       return;
      },
      InsertRange:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,Seq1.toArray(items));
       return;
      },
      RemoveAt:function(x)
      {
       var value;
       value=ResizeArray.splice(this.arr,x,1,[]);
       return;
      },
      RemoveRange:function(index,count)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,count,[]);
       return;
      },
      Reverse:function()
      {
       return this.arr.reverse();
      },
      Reverse1:function(index,count)
      {
       return Arrays.reverse(this.arr,index,count);
      },
      ToArray:function()
      {
       return this.arr.slice();
      },
      get_Count:function()
      {
       return Arrays.length(this.arr);
      },
      get_Item:function(x)
      {
       return Arrays.get(this.arr,x);
      },
      set_Item:function(x,v)
      {
       return Arrays.set(this.arr,x,v);
      }
     },{
      New:function(el)
      {
       return Runtime.New(this,ResizeArrayProxy.New11(Seq1.toArray(el)));
      },
      New1:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      },
      New11:function(arr)
      {
       var r;
       r=Runtime.New(this,{});
       r.arr=arr;
       return r;
      },
      New2:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      }
     }),
     splice:function($arr,$index,$howMany,$items)
     {
      var $0=this,$this=this;
      return Global.Array.prototype.splice.apply($arr,[$index,$howMany].concat($items));
     }
    },
    SetModule:{
     Filter:function(f,s)
     {
      var data;
      data=Seq1.toArray(Seq1.filter(f,s));
      return FSharpSet.New1(BalancedTree.Build(data,0,data.length-1));
     },
     FoldBack:function(f,a,s)
     {
      return Seq1.fold(function(s1)
      {
       return function(x)
       {
        return(f(x))(s1);
       };
      },s,BalancedTree.Enumerate(true,a.get_Tree()));
     },
     Partition:function(f,a)
     {
      var patternInput,y,x;
      patternInput=Arrays.partition(f,Seq1.toArray(a));
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpSet.New1(BalancedTree.OfSeq(x)),FSharpSet.New1(BalancedTree.OfSeq(y))];
     }
    },
    SetUtil:{
     ofSeq:function(s)
     {
      var a;
      a=Seq1.toArray(s);
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.Seq);
  List=Runtime.Safe(Global.WebSharper.List);
  T=Runtime.Safe(List.T);
  Seq1=Runtime.Safe(Global.WebSharper.Seq);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Pair=Runtime.Safe(Collections.Pair);
  Option=Runtime.Safe(Global.WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  SetModule=Runtime.Safe(Collections.SetModule);
  SetUtil=Runtime.Safe(Collections.SetUtil);
  Array=Runtime.Safe(Global.Array);
  HashSetUtil=Runtime.Safe(Collections.HashSetUtil);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  E=Runtime.Safe(LinkedList.E);
  T1=Runtime.Safe(LinkedList.T);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  return ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Json,Provider,Date,List,Arrays,Unchecked,Operators,Collections,FSharpSet,BalancedTree,Dictionary,JavaScript,JSModule,FSharpMap,Seq,Enumerator,MapModule,Internals,window;
 Runtime.Define(Global,{
  WebSharper:{
   Json:{
    Internals:{
     Provider:Runtime.Field(function()
     {
      return Provider.New();
     })
    },
    Provider:Runtime.Class({
     DecodeArray:function(decEl)
     {
      return this.EncodeArray(decEl);
     },
     DecodeDateTime:function()
     {
      return function()
      {
       return function(x)
       {
        return(new Date(x)).getTime();
       };
      };
     },
     DecodeList:function(decEl)
     {
      return function()
      {
       return function(a)
       {
        var decEl1;
        decEl1=decEl(null);
        return List.init(Arrays.length(a),function(i)
        {
         return decEl1(Arrays.get(a,i));
        });
       };
      };
     },
     DecodeRecord:function(t,fields)
     {
      return function()
      {
       return function(x)
       {
        var o,action;
        o=t===undefined?{}:new t();
        action=function(tupledArg)
        {
         var name,dec,kind;
         name=tupledArg[0];
         dec=tupledArg[1];
         kind=tupledArg[2];
         return Unchecked.Equals(kind,0)?void(o[name]=(dec(null))(x[name])):Unchecked.Equals(kind,1)?void(o[name]=x.hasOwnProperty(name)?{
          $:1,
          $0:(dec(null))(x[name])
         }:{
          $:0
         }):Unchecked.Equals(kind,2)?x.hasOwnProperty(name)?void(o[name]=(dec(null))(x[name])):null:Operators.FailWith("Invalid field option kind");
        };
        Arrays.iter(action,fields);
        return o;
       };
      };
     },
     DecodeSet:function(decEl)
     {
      return function()
      {
       return function(a)
       {
        var decEl1;
        decEl1=decEl(null);
        return FSharpSet.New1(BalancedTree.OfSeq(Arrays.map(decEl1,a)));
       };
      };
     },
     DecodeStringDictionary:function(decEl)
     {
      return function()
      {
       return function(o)
       {
        var d;
        d=Dictionary.New12();
        decEl(null);
        JSModule.ForEach(o,function(k)
        {
         d.set_Item(k,o[k]);
         return false;
        });
        return d;
       };
      };
     },
     DecodeStringMap:function(decEl)
     {
      return function()
      {
       return function(o)
       {
        var m;
        m=[FSharpMap.New1([])];
        decEl(null);
        JSModule.ForEach(o,function(k)
        {
         m[0]=m[0].Add(k,o[k]);
         return false;
        });
        return m[0];
       };
      };
     },
     DecodeTuple:function(decs)
     {
      return this.EncodeTuple(decs);
     },
     DecodeUnion:function(t,discr,cases)
     {
      return function()
      {
       return function(x)
       {
        var _,o,tag,_1,tagName,predicate,r,tuple,x1,action;
        if(typeof x==="object")
         {
          o=t===undefined?{}:new t();
          if(Unchecked.Equals(typeof discr,"string"))
           {
            tagName=x[discr];
            predicate=function(tupledArg)
            {
             var name;
             name=tupledArg[0];
             tupledArg[1];
             return name===tagName;
            };
            _1=Arrays.findINdex(predicate,cases);
           }
          else
           {
            r=[undefined];
            JSModule.ForEach(discr,function(k)
            {
             var _2;
             if(x.hasOwnProperty(k))
              {
               r[0]=discr[k];
               _2=true;
              }
             else
              {
               _2=false;
              }
             return _2;
            });
            _1=r[0];
           }
          tag=_1;
          o.$=tag;
          tuple=Arrays.get(cases,tag);
          x1=tuple[1];
          action=function(tupledArg)
          {
           var from,to,dec,kind;
           from=tupledArg[0];
           to=tupledArg[1];
           dec=tupledArg[2];
           kind=tupledArg[3];
           return from===null?void(o.$0=(dec(null))(x)):Unchecked.Equals(kind,0)?void(o[from]=(dec(null))(x[to])):Unchecked.Equals(kind,1)?void(o[from]=x.hasOwnProperty(to)?{
            $:1,
            $0:(dec(null))(x[to])
           }:{
            $:0
           }):Operators.FailWith("Invalid field option kind");
          };
          Arrays.iter(action,x1);
          _=o;
         }
        else
         {
          _=x;
         }
        return _;
       };
      };
     },
     EncodeArray:function(encEl)
     {
      return function()
      {
       return function(a)
       {
        var encEl1;
        encEl1=encEl(null);
        return Arrays.map(encEl1,a);
       };
      };
     },
     EncodeDateTime:function()
     {
      return function()
      {
       return function(x)
       {
        return(new Date(x)).toISOString();
       };
      };
     },
     EncodeList:function(encEl)
     {
      return function()
      {
       return function(l)
       {
        var a,encEl1,action;
        a=[];
        encEl1=encEl(null);
        action=function(x)
        {
         var value;
         value=a.push(encEl1(x));
         return;
        };
        Seq.iter(action,l);
        return a;
       };
      };
     },
     EncodeRecord:function(_arg1,fields)
     {
      return function()
      {
       return function(x)
       {
        var o,action;
        o={};
        action=function(tupledArg)
        {
         var name,enc,kind,_,matchValue,_1,x1;
         name=tupledArg[0];
         enc=tupledArg[1];
         kind=tupledArg[2];
         if(Unchecked.Equals(kind,0))
          {
           _=void(o[name]=(enc(null))(x[name]));
          }
         else
          {
           if(Unchecked.Equals(kind,1))
            {
             matchValue=x[name];
             if(matchValue.$==0)
              {
               _1=null;
              }
             else
              {
               x1=matchValue.$0;
               _1=void(o[name]=(enc(null))(x1));
              }
             _=_1;
            }
           else
            {
             _=Unchecked.Equals(kind,2)?x.hasOwnProperty(name)?void(o[name]=(enc(null))(x[name])):null:Operators.FailWith("Invalid field option kind");
            }
          }
         return _;
        };
        Arrays.iter(action,fields);
        return o;
       };
      };
     },
     EncodeSet:function(encEl)
     {
      return function()
      {
       return function(s)
       {
        var a,encEl1,action;
        a=[];
        encEl1=encEl(null);
        action=function(x)
        {
         var value;
         value=a.push(encEl1(x));
         return;
        };
        Seq.iter(action,s);
        return a;
       };
      };
     },
     EncodeStringDictionary:function(encEl)
     {
      return function()
      {
       return function(d)
       {
        var o,encEl1,enumerator,_,forLoopVar,activePatternResult,v,k;
        o={};
        encEl1=encEl(null);
        enumerator=Enumerator.Get(d);
        try
        {
         while(enumerator.MoveNext())
          {
           forLoopVar=enumerator.get_Current();
           activePatternResult=Operators.KeyValue(forLoopVar);
           v=activePatternResult[1];
           k=activePatternResult[0];
           o[k]=encEl1(v);
          }
        }
        finally
        {
         enumerator.Dispose!=undefined?enumerator.Dispose():null;
        }
        return o;
       };
      };
     },
     EncodeStringMap:function(encEl)
     {
      return function()
      {
       return function(m)
       {
        var o,encEl1,action;
        o={};
        encEl1=encEl(null);
        action=function(k)
        {
         return function(v)
         {
          o[k]=encEl1(v);
         };
        };
        MapModule.Iterate(action,m);
        return o;
       };
      };
     },
     EncodeTuple:function(encs)
     {
      return function()
      {
       return function(args)
       {
        return Arrays.map2(function(f)
        {
         return function(x)
         {
          return(f(null))(x);
         };
        },encs,args);
       };
      };
     },
     EncodeUnion:function(_arg2,discr,cases)
     {
      return function()
      {
       return function(x)
       {
        var _,o,tag,patternInput,tagName,fields,action;
        if(typeof x==="object")
         {
          o={};
          tag=x.$;
          patternInput=Arrays.get(cases,tag);
          tagName=patternInput[0];
          fields=patternInput[1];
          Unchecked.Equals(typeof discr,"string")?void(o[discr]=tagName):null;
          action=function(tupledArg)
          {
           var from,to,enc,kind,_1,record,_2,matchValue,_3,x1;
           from=tupledArg[0];
           to=tupledArg[1];
           enc=tupledArg[2];
           kind=tupledArg[3];
           if(from===null)
            {
             record=(enc(null))(x.$0);
             _1=JSModule.ForEach(record,function(f)
             {
              o[f]=record[f];
              return false;
             });
            }
           else
            {
             if(Unchecked.Equals(kind,0))
              {
               _2=void(o[to]=(enc(null))(x[from]));
              }
             else
              {
               if(Unchecked.Equals(kind,1))
                {
                 matchValue=x[from];
                 if(matchValue.$==0)
                  {
                   _3=null;
                  }
                 else
                  {
                   x1=matchValue.$0;
                   _3=void(o[to]=(enc(null))(x1));
                  }
                 _2=_3;
                }
               else
                {
                 _2=Operators.FailWith("Invalid field option kind");
                }
              }
             _1=_2;
            }
           return _1;
          };
          Arrays.iter(action,fields);
          _=o;
         }
        else
         {
          _=x;
         }
        return _;
       };
      };
     }
    },{
     Id:function()
     {
      return function(x)
      {
       return x;
      };
     },
     New:function()
     {
      return Runtime.New(this,{});
     },
     get_Default:function()
     {
      return Internals.Provider();
     }
    })
   },
   Web:{
    InlineControl:Runtime.Class({
     get_Body:function()
     {
      var f;
      f=Arrays.fold(function(obj)
      {
       return function(field)
       {
        return obj[field];
       };
      },window,this.funcName);
      return f.apply(null,this.args);
     }
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  Json=Runtime.Safe(Global.WebSharper.Json);
  Provider=Runtime.Safe(Json.Provider);
  Date=Runtime.Safe(Global.Date);
  List=Runtime.Safe(Global.WebSharper.List);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  MapModule=Runtime.Safe(Collections.MapModule);
  Internals=Runtime.Safe(Json.Internals);
  return window=Runtime.Safe(Global.window);
 });
 Runtime.OnLoad(function()
 {
  Internals.Provider();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Concurrency,Array,Arrays,Seq,UI,Next,Abbrev,Fresh,Collections,HashSetProxy,HashSet,Slot1,Unchecked,An,AppendList1,Anims,requestAnimationFrame,Trans,Option,View,Lazy,Array1,Attrs,DomUtility,AttrModule,AttrProxy,List,AnimatedAttrNode,Trans1,DynamicAttrNode,View1,document,Doc,Elt,Seq1,Docs,String,CheckedInput,Mailbox,Operators,T,jQuery,NodeSet,DocElemNode,DomNodes,Easing,Easings,Var,Var1,RegExp,FlowBuilder,Flow,Input,DoubleInterpolation,Key,ListModels,RefImpl1,ListModel1,Storage1,ListModel,Dictionary,Model1,Model,encodeURIComponent,Strings,Route,decodeURIComponent,Routing,Router,Trie1,window,Snap1,Async,Ref,ArrayStorage,LocalStorageBackend,JSON,Char,Submitter,Enumerator,ResizeArray,ResizeArrayProxy,MapModule,FSharpMap,RefImpl;
 Runtime.Define(Global,{
  WebSharper:{
   UI:{
    Next:{
     Abbrev:{
      Async:{
       Schedule:function(f)
       {
        var arg00;
        arg00=Concurrency.Delay(function()
        {
         return Concurrency.Return(f(null));
        });
        return Concurrency.Start(arg00,{
         $:0
        });
       },
       StartTo:function(comp,k)
       {
        return Concurrency.StartWithContinuations(comp,k,function()
        {
        },function()
        {
        },{
         $:0
        });
       }
      },
      Dict:{
       ToKeyArray:function(d)
       {
        var arr,action;
        arr=Array(d.count);
        action=function(i)
        {
         return function(kv)
         {
          return Arrays.set(arr,i,kv.K);
         };
        };
        Seq.iteri(action,d);
        return arr;
       },
       ToValueArray:function(d)
       {
        var arr,action;
        arr=Array(d.count);
        action=function(i)
        {
         return function(kv)
         {
          return Arrays.set(arr,i,kv.V);
         };
        };
        Seq.iteri(action,d);
        return arr;
       }
      },
      Fresh:{
       Id:function()
       {
        var _;
        _=Fresh.counter()+1;
        Fresh.counter=function()
        {
         return _;
        };
        return"uid"+Global.String(Fresh.counter());
       },
       Int:function()
       {
        var _;
        _=Fresh.counter()+1;
        Fresh.counter=function()
        {
         return _;
        };
        return Fresh.counter();
       },
       counter:Runtime.Field(function()
       {
        return 0;
       })
      },
      HashSet:{
       Except:function(excluded,included)
       {
        var set;
        set=HashSetProxy.New(HashSet.ToArray(included));
        set.ExceptWith(HashSet.ToArray(excluded));
        return set;
       },
       Filter:function(ok,set)
       {
        var array;
        array=HashSet.ToArray(set);
        return HashSetProxy.New(Arrays.filter(ok,array));
       },
       Intersect:function(a,b)
       {
        var set;
        set=HashSetProxy.New(HashSet.ToArray(a));
        set.IntersectWith(HashSet.ToArray(b));
        return set;
       },
       ToArray:function(set)
       {
        var arr;
        arr=Array(set.get_Count());
        set.CopyTo(arr);
        return arr;
       }
      },
      Mailbox:{
       StartProcessor:function(proc)
       {
        var mail,isActive,work,start,post;
        mail=[];
        isActive=[false];
        work=Concurrency.Delay(function()
        {
         return Concurrency.Combine(Concurrency.While(function()
         {
          return mail.length>0;
         },Concurrency.Delay(function()
         {
          var msg;
          msg=mail.shift();
          return Concurrency.Bind(proc(msg),function()
          {
           return Concurrency.Return(null);
          });
         })),Concurrency.Delay(function()
         {
          return Concurrency.Return(void(isActive[0]=false));
         }));
        });
        start=function()
        {
         var _;
         if(!isActive[0])
          {
           isActive[0]=true;
           _=Concurrency.Start(work,{
            $:0
           });
          }
         else
          {
           _=null;
          }
         return _;
        };
        post=function(msg)
        {
         mail.push(msg);
         return start(null);
        };
        return post;
       }
      },
      Slot:Runtime.Class({},{
       Create:function(key,value)
       {
        return Slot1.New(key,value);
       }
      }),
      Slot1:Runtime.Class({
       Equals:function(o)
       {
        return Unchecked.Equals(this.key.call(null,this.value),this.key.call(null,o.get_Value()));
       },
       GetHashCode:function()
       {
        return Unchecked.Hash(this.key.call(null,this.value));
       },
       get_Value:function()
       {
        return this.value;
       }
      },{
       New:function(key,value)
       {
        var r;
        r=Runtime.New(this,{});
        r.key=key;
        r.value=value;
        return r;
       }
      })
     },
     An:Runtime.Class({},{
      Append:function(_arg2,_arg1)
      {
       var a,b;
       a=_arg2.$0;
       b=_arg1.$0;
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Append(a,b)
       });
      },
      Concat:function(xs)
      {
       var _arg00_,arg0;
       _arg00_=Seq.map(function(_arg00_1)
       {
        return Anims.List(_arg00_1);
       },xs);
       arg0=AppendList1.Concat(_arg00_);
       return Runtime.New(An,{
        $:0,
        $0:arg0
       });
      },
      Const:function(v)
      {
       return Anims.Const(v);
      },
      Delayed:function(inter,easing,dur,delay,x,y)
      {
       var Duration;
       Duration=dur+delay;
       return{
        Compute:function(t)
        {
         var _,normalisedTime;
         if(t<=delay)
          {
           _=x;
          }
         else
          {
           normalisedTime=easing.TransformTime.call(null,(t-delay)/dur);
           _=inter.Interpolate(normalisedTime,x,y);
          }
         return _;
        },
        Duration:Duration
       };
      },
      Map:function(f,anim)
      {
       var f1;
       f1=anim.Compute;
       return Anims.Def(anim.Duration,function(x)
       {
        return f(f1(x));
       });
      },
      Pack:function(anim)
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Single({
         $:1,
         $0:anim
        })
       });
      },
      Play:function(anim)
      {
       return Concurrency.Delay(function()
       {
        var arg00,arg10;
        arg00=function()
        {
        };
        arg10=Anims.Actions(anim);
        return Concurrency.Bind(An.Run(arg00,arg10),function()
        {
         return Concurrency.Return(Anims.Finalize(anim));
        });
       });
      },
      Run:function(k,anim)
      {
       var dur,arg00;
       dur=anim.Duration;
       arg00=function(tupledArg)
       {
        var ok,_arg1,_arg2,loop,value1;
        ok=tupledArg[0];
        _arg1=tupledArg[1];
        _arg2=tupledArg[2];
        loop=function(start,now)
        {
         var t,_,value;
         t=now-start;
         k(anim.Compute.call(null,t));
         if(t<=dur)
          {
           value=requestAnimationFrame(function(t1)
           {
            return loop(start,t1);
           });
           _=void value;
          }
         else
          {
           _=ok(null);
          }
         return _;
        };
        value1=requestAnimationFrame(function(t)
        {
         return loop(t,t);
        });
        return;
       };
       return Concurrency.FromContinuations(arg00);
      },
      Simple:function(inter,easing,dur,x,y)
      {
       return{
        Compute:function(t)
        {
         var t1;
         t1=easing.TransformTime.call(null,t/dur);
         return inter.Interpolate(t1,x,y);
        },
        Duration:dur
       };
      },
      WhenDone:function(f,main)
      {
       var arg00;
       arg00=Runtime.New(An,{
        $:0,
        $0:AppendList1.Single({
         $:0,
         $0:f
        })
       });
       return An.Append(arg00,main);
      },
      get_Empty:function()
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Empty()
       });
      }
     }),
     AnimatedAttrNode:Runtime.Class({
      GetChangeAnim:function(parent)
      {
       var matchValue,arg00,a=this,arg10,_,_1,_2,l,v,arg001,arg002,arg101,x;
       matchValue=[this.visible,this.logical];
       arg00=function()
       {
        return a.sync(parent);
       };
       if(matchValue[0].$==1)
        {
         if(matchValue[1].$==1)
          {
           matchValue[0].$0;
           matchValue[1].$0;
           if(a.dirty)
            {
             l=matchValue[1].$0;
             v=matchValue[0].$0;
             arg001=a.tr;
             arg002=function(v1)
             {
              return a.pushVisible(parent,v1);
             };
             arg101=Trans.AnimateChange(arg001,v,l);
             x=An.Map(arg002,arg101);
             _2=An.Pack(x);
            }
           else
            {
             _2=An.get_Empty();
            }
           _1=_2;
          }
         else
          {
           _1=An.get_Empty();
          }
         _=_1;
        }
       else
        {
         _=An.get_Empty();
        }
       arg10=_;
       return An.WhenDone(arg00,arg10);
      },
      GetEnterAnim:function(parent)
      {
       var matchValue,arg00,a=this,arg10,_,_1,_2,lo,vi,arg001,arg002,arg101,x,_3,_4,lo1,arg003,arg004,arg102,x1,_5,_6,lo2,arg005,arg006,arg103,x2,_7,_8,lo3,arg007,arg008,arg104,x3;
       matchValue=[this.visible,this.logical];
       arg00=function()
       {
        return a.sync(parent);
       };
       if(matchValue[0].$==1)
        {
         if(matchValue[1].$==1)
          {
           matchValue[0].$0;
           matchValue[1].$0;
           if(a.dirty)
            {
             lo=matchValue[1].$0;
             vi=matchValue[0].$0;
             arg001=a.tr;
             arg002=function(v)
             {
              return a.pushVisible(parent,v);
             };
             arg101=Trans.AnimateChange(arg001,vi,lo);
             x=An.Map(arg002,arg101);
             _2=An.Pack(x);
            }
           else
            {
             if(matchValue[0].$==0)
              {
               if(matchValue[1].$==1)
                {
                 lo1=matchValue[1].$0;
                 arg003=a.tr;
                 arg004=function(v)
                 {
                  return a.pushVisible(parent,v);
                 };
                 arg102=Trans.AnimateEnter(arg003,lo1);
                 x1=An.Map(arg004,arg102);
                 _4=An.Pack(x1);
                }
               else
                {
                 _4=An.get_Empty();
                }
               _3=_4;
              }
             else
              {
               _3=An.get_Empty();
              }
             _2=_3;
            }
           _1=_2;
          }
         else
          {
           if(matchValue[0].$==0)
            {
             if(matchValue[1].$==1)
              {
               lo2=matchValue[1].$0;
               arg005=a.tr;
               arg006=function(v)
               {
                return a.pushVisible(parent,v);
               };
               arg103=Trans.AnimateEnter(arg005,lo2);
               x2=An.Map(arg006,arg103);
               _6=An.Pack(x2);
              }
             else
              {
               _6=An.get_Empty();
              }
             _5=_6;
            }
           else
            {
             _5=An.get_Empty();
            }
           _1=_5;
          }
         _=_1;
        }
       else
        {
         if(matchValue[0].$==0)
          {
           if(matchValue[1].$==1)
            {
             lo3=matchValue[1].$0;
             arg007=a.tr;
             arg008=function(v)
             {
              return a.pushVisible(parent,v);
             };
             arg104=Trans.AnimateEnter(arg007,lo3);
             x3=An.Map(arg008,arg104);
             _8=An.Pack(x3);
            }
           else
            {
             _8=An.get_Empty();
            }
           _7=_8;
          }
         else
          {
           _7=An.get_Empty();
          }
         _=_7;
        }
       arg10=_;
       return An.WhenDone(arg00,arg10);
      },
      GetExitAnim:function(parent)
      {
       var matchValue,arg00,a=this,arg10,_,cur,arg001,arg002,arg101,x;
       matchValue=this.visible;
       arg00=function()
       {
        a.dirty=true;
        a.visible={
         $:0
        };
        return;
       };
       if(matchValue.$==1)
        {
         cur=matchValue.$0;
         arg001=a.tr;
         arg002=function(v)
         {
          return a.pushVisible(parent,v);
         };
         arg101=Trans.AnimateExit(arg001,cur);
         x=An.Map(arg002,arg101);
         _=An.Pack(x);
        }
       else
        {
         _=An.get_Empty();
        }
       arg10=_;
       return An.WhenDone(arg00,arg10);
      },
      Init:function()
      {
       return null;
      },
      Sync:function()
      {
       return null;
      },
      get_Changed:function()
      {
       return this.updates;
      },
      pushVisible:function(el,v)
      {
       this.visible={
        $:1,
        $0:v
       };
       this.dirty=true;
       return(this.push.call(null,el))(v);
      },
      sync:function(p)
      {
       var _;
       if(this.dirty)
        {
         Option.iter(this.push.call(null,p),this.logical);
         this.visible=this.logical;
         _=void(this.dirty=false);
        }
       else
        {
         _=null;
        }
       return _;
      }
     },{
      New:function(tr,view,push)
      {
       var r,arg00;
       r=Runtime.New(this,{});
       r.tr=tr;
       r.push=push;
       r.logical={
        $:0
       };
       r.visible={
        $:0
       };
       r.dirty=true;
       arg00=function(x)
       {
        r.logical={
         $:1,
         $0:x
        };
        r.dirty=true;
        return;
       };
       r.updates=View.Map(arg00,view);
       return r;
      }
     }),
     Anims:{
      Actions:function(_arg1)
      {
       var all,chooser,array,xs;
       all=_arg1.$0;
       chooser=function(_arg2)
       {
        var _,w;
        if(_arg2.$==1)
         {
          w=_arg2.$0;
          _={
           $:1,
           $0:w
          };
         }
        else
         {
          _={
           $:0
          };
         }
        return _;
       };
       array=AppendList1.ToArray(all);
       xs=Arrays.choose(chooser,array);
       return Anims.ConcatActions(xs);
      },
      ConcatActions:function(xs)
      {
       var xs1,matchValue,_,mapping,source,dur,xs2;
       xs1=Seq.toArray(xs);
       matchValue=Arrays.length(xs1);
       if(matchValue===0)
        {
         _=Anims.Const(null);
        }
       else
        {
         if(matchValue===1)
          {
           _=Arrays.get(xs1,0);
          }
         else
          {
           mapping=function(anim)
           {
            return anim.Duration;
           };
           source=Seq.map(mapping,xs1);
           dur=Seq.max(source);
           xs2=Arrays.map(function(anim)
           {
            return Anims.Prolong(dur,anim);
           },xs1);
           _=Anims.Def(dur,function(t)
           {
            return Arrays.iter(function(anim)
            {
             return anim.Compute.call(null,t);
            },xs2);
           });
          }
        }
       return _;
      },
      Const:function(v)
      {
       return Anims.Def(0,function()
       {
        return v;
       });
      },
      Def:function(d,f)
      {
       return{
        Compute:f,
        Duration:d
       };
      },
      Finalize:function(_arg1)
      {
       var all,action,array;
       all=_arg1.$0;
       action=function(_arg2)
       {
        var _,f;
        if(_arg2.$==0)
         {
          f=_arg2.$0;
          _=f(null);
         }
        else
         {
          _=null;
         }
        return _;
       };
       array=AppendList1.ToArray(all);
       return Arrays.iter(action,array);
      },
      List:function(_arg1)
      {
       var xs;
       xs=_arg1.$0;
       return xs;
      },
      Prolong:function(nextDuration,anim)
      {
       var comp,dur,last,compute;
       comp=anim.Compute;
       dur=anim.Duration;
       last=Lazy.Create(function()
       {
        return anim.Compute.call(null,anim.Duration);
       });
       compute=function(t)
       {
        return t>=dur?last.eval():comp(t);
       };
       return{
        Compute:compute,
        Duration:nextDuration
       };
      }
     },
     AppendList1:{
      Append:function(x,y)
      {
       var matchValue,_,x1,_1,x2;
       matchValue=[x,y];
       if(matchValue[0].$==0)
        {
         x1=matchValue[1];
         _=x1;
        }
       else
        {
         if(matchValue[1].$==0)
          {
           x2=matchValue[0];
           _1=x2;
          }
         else
          {
           _1={
            $:2,
            $0:x,
            $1:y
           };
          }
         _=_1;
        }
       return _;
      },
      Concat:function(xs)
      {
       var x,f,z,re;
       x=Seq.toArray(xs);
       f=function(x1)
       {
        return x1;
       };
       z=AppendList1.Empty();
       re=function(_arg00_)
       {
        return function(_arg10_)
        {
         return AppendList1.Append(_arg00_,_arg10_);
        };
       };
       return Array1.MapReduce(f,z,re,x);
      },
      Empty:function()
      {
       return{
        $:0
       };
      },
      FromArray:function(xs)
      {
       var matchValue;
       matchValue=xs.length;
       return matchValue===0?{
        $:0
       }:matchValue===1?{
        $:1,
        $0:Arrays.get(xs,0)
       }:{
        $:3,
        $0:xs.slice()
       };
      },
      Single:function(x)
      {
       return{
        $:1,
        $0:x
       };
      },
      ToArray:function(xs)
      {
       var out,loop;
       out=[];
       loop=function(xs1)
       {
        var _,x,y,x1,xs2;
        if(xs1.$==1)
         {
          x=xs1.$0;
          _=out.push(x);
         }
        else
         {
          if(xs1.$==2)
           {
            y=xs1.$1;
            x1=xs1.$0;
            loop(x1);
            _=loop(y);
           }
          else
           {
            if(xs1.$==3)
             {
              xs2=xs1.$0;
              _=Arrays.iter(function(v)
              {
               return out.push(v);
              },xs2);
             }
            else
             {
              _=null;
             }
           }
         }
        return _;
       };
       loop(xs);
       return out.slice(0);
      }
     },
     Array:{
      MapReduce:function(f,z,re,a)
      {
       var loop;
       loop=function(off,len)
       {
        var _,_1,_2,l2,a1,b,l21,a2,b1;
        if(len<=0)
         {
          _=z;
         }
        else
         {
          if(len===1)
           {
            if(off>=0?off<Arrays.length(a):false)
             {
              _2=f(Arrays.get(a,off));
             }
            else
             {
              l2=len/2>>0;
              a1=loop(off,l2);
              b=loop(off+l2,len-l2);
              _2=(re(a1))(b);
             }
            _1=_2;
           }
          else
           {
            l21=len/2>>0;
            a2=loop(off,l21);
            b1=loop(off+l21,len-l21);
            _1=(re(a2))(b1);
           }
          _=_1;
         }
        return _;
       };
       return loop(0,Arrays.length(a));
      }
     },
     AttrModule:{
      Animated:function(name,tr,view,attr)
      {
       return Attrs.Animated(tr,view,function(el)
       {
        return function(v)
        {
         return DomUtility.SetAttr(el,name,attr(v));
        };
       });
      },
      AnimatedStyle:function(name,tr,view,attr)
      {
       return Attrs.Animated(tr,view,function(el)
       {
        return function(v)
        {
         return DomUtility.SetStyle(el,name,attr(v));
        };
       });
      },
      Class:function(name)
      {
       return Attrs.Static(function(el)
       {
        return DomUtility.AddClass(el,name);
       });
      },
      ContentEditableHtml:function(_var)
      {
       var x,arg00;
       x=AttrModule.CustomVar(_var,function(e)
       {
        return function(v)
        {
         e.innerHTML=v;
        };
       },function(e)
       {
        return{
         $:1,
         $0:e.innerHTML
        };
       });
       arg00=AttrProxy.Create("contenteditable","true");
       return AttrProxy.Append(arg00,x);
      },
      ContentEditableText:function(_var)
      {
       var x,arg00;
       x=AttrModule.CustomVar(_var,function(e)
       {
        return function(v)
        {
         e.textContent=v;
        };
       },function(e)
       {
        return{
         $:1,
         $0:e.textContent
        };
       });
       arg00=AttrProxy.Create("contenteditable","true");
       return AttrProxy.Append(arg00,x);
      },
      CustomValue:function(_var,toString,fromString)
      {
       return AttrModule.CustomVar(_var,function(e)
       {
        return function(v)
        {
         e.value=toString(v);
        };
       },function(e)
       {
        return fromString(e.value);
       });
      },
      CustomVar:function(_var,set,get)
      {
       var onChange,set1;
       onChange=function(el)
       {
        return function()
        {
         return _var.UpdateMaybe(function(v)
         {
          var matchValue,_,x,_1;
          matchValue=get(el);
          if(matchValue.$==1)
           {
            x=matchValue.$0;
            if(!Unchecked.Equals(x,v))
             {
              matchValue.$0;
              _1=matchValue;
             }
            else
             {
              _1={
               $:0
              };
             }
            _=_1;
           }
          else
           {
            _={
             $:0
            };
           }
          return _;
         });
        };
       };
       set1=function(e)
       {
        return function(v)
        {
         var matchValue,_,x,_1;
         matchValue=get(e);
         if(matchValue.$==1)
          {
           x=matchValue.$0;
           if(Unchecked.Equals(x,v))
            {
             matchValue.$0;
             _1=null;
            }
           else
            {
             _1=(set(e))(v);
            }
           _=_1;
          }
         else
          {
           _=(set(e))(v);
          }
         return _;
        };
       };
       return AttrProxy.Concat(List.ofArray([AttrModule.Handler("change",onChange),AttrModule.Handler("input",onChange),AttrModule.Handler("keypress",onChange),AttrModule.DynamicCustom(set1,_var.get_View())]));
      },
      Dynamic:function(name,view)
      {
       return Attrs.Dynamic(view,function()
       {
       },function(el)
       {
        return function(v)
        {
         return DomUtility.SetAttr(el,name,v);
        };
       });
      },
      DynamicClass:function(name,view,ok)
      {
       return Attrs.Dynamic(view,function()
       {
       },function(el)
       {
        return function(v)
        {
         return ok(v)?DomUtility.AddClass(el,name):DomUtility.RemoveClass(el,name);
        };
       });
      },
      DynamicCustom:function(set,view)
      {
       return Attrs.Dynamic(view,function()
       {
       },set);
      },
      DynamicPred:function(name,predView,valView)
      {
       var viewFn,arg00,tupleView;
       viewFn=function(el)
       {
        return function(tupledArg)
        {
         var p,v;
         p=tupledArg[0];
         v=tupledArg[1];
         return p?DomUtility.SetAttr(el,name,v):DomUtility.RemoveAttr(el,name);
        };
       };
       arg00=function(pred)
       {
        return function(value)
        {
         return[pred,value];
        };
       };
       tupleView=View.Map2(arg00,predView,valView);
       return Attrs.Dynamic(tupleView,function()
       {
       },viewFn);
      },
      DynamicProp:function(name,view)
      {
       return Attrs.Dynamic(view,function()
       {
       },function(el)
       {
        return function(v)
        {
         el[name]=v;
        };
       });
      },
      DynamicStyle:function(name,view)
      {
       return Attrs.Dynamic(view,function()
       {
       },function(el)
       {
        return function(v)
        {
         return DomUtility.SetStyle(el,name,v);
        };
       });
      },
      Handler:function(name,callback)
      {
       return Attrs.Static(function(el)
       {
        return el.addEventListener(name,callback(el),false);
       });
      },
      HandlerView:function(name,view,callback)
      {
       var id,init,cb;
       id=Fresh.Id();
       init=function(el)
       {
        var callback1;
        callback1=callback(el);
        return el.addEventListener(name,function(ev)
        {
         return(callback1(ev))(el[id]);
        },false);
       };
       cb=function(el)
       {
        return function(x)
        {
         el[id]=x;
        };
       };
       return Attrs.Dynamic(view,init,cb);
      },
      OnAfterRender:function(callback)
      {
       return Attrs.Mk(0,{
        $:4,
        $0:callback
       });
      },
      OnAfterRenderView:function(v,callback)
      {
       var id,arg00,arg10;
       id=Fresh.Id();
       arg00=AttrModule.OnAfterRender(function(el)
       {
        return(callback(el))(el[id]);
       });
       arg10=AttrModule.DynamicCustom(function(el)
       {
        return function(x)
        {
         el[id]=x;
        };
       },v);
       return AttrProxy.Append(arg00,arg10);
      },
      Style:function(name,value)
      {
       return Attrs.Static(function(el)
       {
        return DomUtility.SetStyle(el,name,value);
       });
      },
      ValidateForm:function()
      {
       return AttrModule.OnAfterRender(function(e)
       {
        return Global.H5F?Global.H5F.setup(e):undefined;
       });
      },
      Value:function(_var)
      {
       return AttrModule.CustomValue(_var,function(x)
       {
        return x;
       },function(x)
       {
        return{
         $:1,
         $0:x
        };
       });
      }
     },
     AttrProxy:Runtime.Class({},{
      Append:function(a,b)
      {
       return Attrs.Mk(a.Flags|b.Flags,Attrs.AppendTree(a.Tree,b.Tree));
      },
      Concat:function(xs)
      {
       var x,f,z,re;
       x=Seq.toArray(xs);
       f=function(x1)
       {
        return x1;
       };
       z=AttrProxy.get_Empty();
       re=function(arg00)
       {
        return function(arg10)
        {
         return AttrProxy.Append(arg00,arg10);
        };
       };
       return Array1.MapReduce(f,z,re,x);
      },
      Create:function(name,value)
      {
       return Attrs.Static(function(el)
       {
        return DomUtility.SetAttr(el,name,value);
       });
      },
      Handler:function(event,q)
      {
       return Attrs.Static(function(el)
       {
        return el.addEventListener(event,q(el),false);
       });
      },
      get_Empty:function()
      {
       return Attrs.EmptyAttr();
      }
     }),
     Attrs:{
      Animated:function(tr,view,set)
      {
       var node,flags;
       node=AnimatedAttrNode.New(tr,view,set);
       flags=4;
       Trans1.CanAnimateEnter(tr)?flags=flags|1:null;
       Trans1.CanAnimateExit(tr)?flags=flags|2:null;
       return Attrs.Mk(flags,{
        $:1,
        $0:node
       });
      },
      AppendTree:function(a,b)
      {
       var matchValue,_,x,_1,x1;
       matchValue=[a,b];
       if(matchValue[0].$==0)
        {
         x=matchValue[1];
         _=x;
        }
       else
        {
         if(matchValue[1].$==0)
          {
           x1=matchValue[0];
           _1=x1;
          }
         else
          {
           _1={
            $:2,
            $0:a,
            $1:b
           };
          }
         _=_1;
        }
       return _;
      },
      Dynamic:function(view,init,set)
      {
       var tree;
       tree={
        $:1,
        $0:DynamicAttrNode.New(view,init,set)
       };
       return Attrs.Mk(0,tree);
      },
      EmptyAttr:Runtime.Field(function()
      {
       return Attrs.Mk(0,{
        $:0
       });
      }),
      GetAnim:function(dyn,f)
      {
       var mapping,array,arg00;
       mapping=function(n)
       {
        return(f(n))(dyn.DynElem);
       };
       array=dyn.DynNodes;
       arg00=Arrays.map(mapping,array);
       return An.Concat(arg00);
      },
      GetChangeAnim:function(dyn)
      {
       return Attrs.GetAnim(dyn,function(n)
       {
        return function(arg00)
        {
         return n.GetChangeAnim(arg00);
        };
       });
      },
      GetEnterAnim:function(dyn)
      {
       return Attrs.GetAnim(dyn,function(n)
       {
        return function(arg00)
        {
         return n.GetEnterAnim(arg00);
        };
       });
      },
      GetExitAnim:function(dyn)
      {
       return Attrs.GetAnim(dyn,function(n)
       {
        return function(arg00)
        {
         return n.GetExitAnim(arg00);
        };
       });
      },
      HasChangeAnim:function(attr)
      {
       return(attr.DynFlags&4)!==0;
      },
      HasEnterAnim:function(attr)
      {
       return(attr.DynFlags&1)!==0;
      },
      HasExitAnim:function(attr)
      {
       return(attr.DynFlags&2)!==0;
      },
      Insert:function(elem,tree)
      {
       var nodes,oar,loop,arr;
       nodes=[];
       oar=[];
       loop=function(node)
       {
        var _,n,b,a,mk,cb;
        if(node.$==1)
         {
          n=node.$0;
          n.Init(elem);
          _=nodes.push(n);
         }
        else
         {
          if(node.$==2)
           {
            b=node.$1;
            a=node.$0;
            loop(a);
            _=loop(b);
           }
          else
           {
            if(node.$==3)
             {
              mk=node.$0;
              _=mk(elem);
             }
            else
             {
              if(node.$==4)
               {
                cb=node.$0;
                _=oar.push(cb);
               }
              else
               {
                _=null;
               }
             }
           }
         }
        return _;
       };
       loop(tree.Tree);
       arr=nodes.slice(0);
       return Runtime.DeleteEmptyFields({
        DynElem:elem,
        DynFlags:tree.Flags,
        DynNodes:arr,
        OnAfterRender:(oar.length===0?{
         $:0
        }:{
         $:1,
         $0:function(el)
         {
          return Seq.iter(function(f)
          {
           return f(el);
          },oar);
         }
        }).$0
       },["OnAfterRender"]);
      },
      Mk:function(flags,tree)
      {
       return Runtime.New(AttrProxy,{
        Flags:flags,
        Tree:tree
       });
      },
      Static:function(attr)
      {
       return Attrs.Mk(0,{
        $:3,
        $0:attr
       });
      },
      Sync:function(elem,dyn)
      {
       var action,array;
       action=function(d)
       {
        return d.Sync(elem);
       };
       array=dyn.DynNodes;
       return Arrays.iter(action,array);
      },
      Updates:function(dyn)
      {
       var p,x1,f,z;
       p=function(x)
       {
        return function(y)
        {
         var arg00;
         arg00=function()
         {
          return function()
          {
           return null;
          };
         };
         return View.Map2(arg00,x,y);
        };
       };
       x1=dyn.DynNodes;
       f=function(x)
       {
        return x.get_Changed();
       };
       z=View1.Const(null);
       return Array1.MapReduce(f,z,p,x1);
      }
     },
     CheckedInput:Runtime.Class({
      get_Input:function()
      {
       var _,x,x1,x2;
       if(this.$==1)
        {
         x=this.$0;
         _=x;
        }
       else
        {
         if(this.$==2)
          {
           x1=this.$0;
           _=x1;
          }
         else
          {
           x2=this.$1;
           _=x2;
          }
        }
       return _;
      }
     }),
     Doc:Runtime.Class({
      ReplaceInDom:function(elt)
      {
       var rdelim,value;
       rdelim=document.createTextNode("");
       value=elt.parentNode.replaceChild(rdelim,elt);
       return Doc.RunBefore(rdelim,this);
      },
      get_DocNode:function()
      {
       return this.docNode;
      },
      get_Updates:function()
      {
       return this.updates;
      }
     },{
      Append:function(a,b)
      {
       var arg00,arg10,arg20,x,arg001;
       arg00=function()
       {
        return function()
        {
         return null;
        };
       };
       arg10=a.get_Updates();
       arg20=b.get_Updates();
       x=View.Map2(arg00,arg10,arg20);
       arg001={
        $:0,
        $0:a.get_DocNode(),
        $1:b.get_DocNode()
       };
       return Doc.Mk(arg001,x);
      },
      Async:function(a)
      {
       var arg00,arg10,arg001;
       arg00=function(x)
       {
        return x;
       };
       arg10=View1.Const(a);
       arg001=View.MapAsync(arg00,arg10);
       return Doc.EmbedView(arg001);
      },
      BindView:function(f,view)
      {
       return Doc.EmbedView(View.Map(f,view));
      },
      Button:function(caption,attrs,action)
      {
       var attrs1,el,arg20;
       attrs1=AttrProxy.Concat(attrs);
       el=Doc.Clickable("button",action);
       arg20=Doc.TextNode(caption);
       return Elt.New(el,attrs1,arg20);
      },
      ButtonView:function(caption,attrs,view,action)
      {
       var evAttr,attrs1,arg00,arg20;
       evAttr=AttrModule.HandlerView("click",view,function()
       {
        return function()
        {
         return action;
        };
       });
       attrs1=AttrProxy.Concat(Seq.append([evAttr],attrs));
       arg00=DomUtility.CreateElement("button");
       arg20=Doc.TextNode(caption);
       return Elt.New(arg00,attrs1,arg20);
      },
      CheckBox:function(attrs,chk)
      {
       var el,onClick,attrs1,arg20;
       el=DomUtility.CreateElement("input");
       onClick=function()
       {
        return chk.Set(el.checked);
       };
       el.addEventListener("click",onClick,false);
       attrs1=AttrProxy.Concat(Seq.toList(Seq.delay(function()
       {
        return Seq.append(attrs,Seq.delay(function()
        {
         return Seq.append([AttrProxy.Create("type","checkbox")],Seq.delay(function()
         {
          return[AttrModule.DynamicProp("checked",chk.get_View())];
         }));
        }));
       })));
       arg20=Doc.get_Empty();
       return Elt.New(el,attrs1,arg20);
      },
      CheckBoxGroup:function(attrs,item,chk)
      {
       var rvi,updateList,predicate,arg00,checkedView,arg001,arg10,arg101,attrs1,el,onClick,arg20;
       rvi=chk.get_View();
       updateList=function(chkd)
       {
        return chk.Update(function(obs)
        {
         var obs1,source;
         obs1=chkd?List.append(obs,List.ofArray([item])):List.filter(function(x)
         {
          return!Unchecked.Equals(x,item);
         },obs);
         source=Seq1.distinct(obs1);
         return Seq.toList(source);
        });
       };
       predicate=function(x)
       {
        return Unchecked.Equals(x,item);
       };
       arg00=function(list)
       {
        return Seq.exists(predicate,list);
       };
       checkedView=View.Map(arg00,rvi);
       arg10=chk.get_Id();
       arg101=Fresh.Id();
       arg001=List.append(List.ofArray([AttrProxy.Create("type","checkbox"),AttrProxy.Create("name",arg10),AttrProxy.Create("value",arg101),AttrModule.DynamicProp("checked",checkedView)]),List.ofSeq(attrs));
       attrs1=AttrProxy.Concat(arg001);
       el=DomUtility.CreateElement("input");
       onClick=function()
       {
        var chkd;
        chkd=el.checked;
        return updateList(chkd);
       };
       el.addEventListener("click",onClick,false);
       arg20=Doc.get_Empty();
       return Elt.New(el,attrs1,arg20);
      },
      Clickable:function(elem,action)
      {
       var el;
       el=DomUtility.CreateElement(elem);
       el.addEventListener("click",function(ev)
       {
        ev.preventDefault();
        return action(null);
       },false);
       return el;
      },
      Concat:function(xs)
      {
       var x,f,z,re;
       x=Seq.toArray(xs);
       f=function(x1)
       {
        return x1;
       };
       z=Doc.get_Empty();
       re=function(arg00)
       {
        return function(arg10)
        {
         return Doc.Append(arg00,arg10);
        };
       };
       return Array1.MapReduce(f,z,re,x);
      },
      Convert:function(render,view)
      {
       var arg00;
       arg00=View.MapSeqCached(render,view);
       return Doc.Flatten(arg00);
      },
      ConvertBy:function(key,render,view)
      {
       var arg00;
       arg00=View.MapSeqCachedBy(key,render,view);
       return Doc.Flatten(arg00);
      },
      ConvertSeq:function(render,view)
      {
       var arg00;
       arg00=View.MapSeqCachedView(render,view);
       return Doc.Flatten(arg00);
      },
      ConvertSeqBy:function(key,render,view)
      {
       var arg00;
       arg00=View.MapSeqCachedViewBy(key,render,view);
       return Doc.Flatten(arg00);
      },
      Element:function(name,attr,children)
      {
       var attr1,children1,arg00;
       attr1=AttrProxy.Concat(attr);
       children1=Doc.Concat(children);
       arg00=DomUtility.CreateElement(name);
       return Elt.New(arg00,attr1,children1);
      },
      EmbedView:function(view)
      {
       var node,arg00,arg001,arg10,x,arg002;
       node=Docs.CreateEmbedNode();
       arg00=function(doc)
       {
        Docs.UpdateEmbedNode(node,doc.get_DocNode());
        return doc.get_Updates();
       };
       arg001=function()
       {
       };
       arg10=View1.Bind(arg00,view);
       x=View.Map(arg001,arg10);
       arg002={
        $:2,
        $0:node
       };
       return Doc.Mk(arg002,x);
      },
      Flatten:function(view)
      {
       var arg00,arg002;
       arg00=function(arg001)
       {
        return Doc.Concat(arg001);
       };
       arg002=View.Map(arg00,view);
       return Doc.EmbedView(arg002);
      },
      FloatInput:function(attr,_var)
      {
       var parseCheckedFloat,arg10;
       parseCheckedFloat=function(el)
       {
        return function(s)
        {
         var arg0,_,i;
         if(String.isBlank(s))
          {
           _=(el.checkValidity?el.checkValidity():true)?Runtime.New(CheckedInput,{
            $:2,
            $0:s
           }):Runtime.New(CheckedInput,{
            $:1,
            $0:s
           });
          }
         else
          {
           i=+s;
           _=Global.isNaN(i)?Runtime.New(CheckedInput,{
            $:1,
            $0:s
           }):Runtime.New(CheckedInput,{
            $:0,
            $0:i,
            $1:s
           });
          }
         arg0=_;
         return{
          $:1,
          $0:arg0
         };
        };
       };
       arg10=function(el)
       {
        return Seq.append(attr,[AttrModule.CustomValue(_var,function(i)
        {
         return i.get_Input();
        },parseCheckedFloat(el)),AttrProxy.Create("type","number")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      FloatInputUnchecked:function(attr,_var)
      {
       var parseFloat,arg10;
       parseFloat=function(s)
       {
        var _,pd;
        if(String.isBlank(s))
         {
          _={
           $:1,
           $0:0
          };
         }
        else
         {
          pd=+s;
          _=Global.isNaN(pd)?{
           $:0
          }:{
           $:1,
           $0:pd
          };
         }
        return _;
       };
       arg10=function()
       {
        return Seq.append(attr,[_var.Get()===0?AttrProxy.Create("value","0"):AttrProxy.get_Empty(),AttrModule.CustomValue(_var,function(value)
        {
         return Global.String(value);
        },parseFloat),AttrProxy.Create("type","number")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      Input:function(attr,_var)
      {
       var arg10;
       arg10=function()
       {
        return Seq.append(attr,[AttrModule.Value(_var)]);
       };
       return Doc.InputInternal("input",arg10);
      },
      InputArea:function(attr,_var)
      {
       var arg10;
       arg10=function()
       {
        return Seq.append(attr,[AttrModule.Value(_var)]);
       };
       return Doc.InputInternal("textarea",arg10);
      },
      InputInternal:function(elemTy,attr)
      {
       var el,arg10,arg20;
       el=DomUtility.CreateElement(elemTy);
       arg10=AttrProxy.Concat(attr(el));
       arg20=Doc.get_Empty();
       return Elt.New(el,arg10,arg20);
      },
      IntInput:function(attr,_var)
      {
       var parseCheckedInt,arg10;
       parseCheckedInt=function(el)
       {
        return function(s)
        {
         var arg0,_,i;
         if(String.isBlank(s))
          {
           _=(el.checkValidity?el.checkValidity():true)?Runtime.New(CheckedInput,{
            $:2,
            $0:s
           }):Runtime.New(CheckedInput,{
            $:1,
            $0:s
           });
          }
         else
          {
           i=+s;
           _=Global.isNaN(i)?Runtime.New(CheckedInput,{
            $:1,
            $0:s
           }):Runtime.New(CheckedInput,{
            $:0,
            $0:i,
            $1:s
           });
          }
         arg0=_;
         return{
          $:1,
          $0:arg0
         };
        };
       };
       arg10=function(el)
       {
        return Seq.append(attr,[AttrModule.CustomValue(_var,function(i)
        {
         return i.get_Input();
        },parseCheckedInt(el)),AttrProxy.Create("type","number"),AttrProxy.Create("step","1")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      IntInputUnchecked:function(attr,_var)
      {
       var parseInt,arg10;
       parseInt=function(s)
       {
        var _,pd;
        if(String.isBlank(s))
         {
          _={
           $:1,
           $0:0
          };
         }
        else
         {
          pd=+s;
          _=pd!==pd>>0?{
           $:0
          }:{
           $:1,
           $0:pd
          };
         }
        return _;
       };
       arg10=function()
       {
        return Seq.append(attr,[_var.Get()===0?AttrProxy.Create("value","0"):AttrProxy.get_Empty(),AttrModule.CustomValue(_var,function(value)
        {
         return Global.String(value);
        },parseInt),AttrProxy.Create("type","number"),AttrProxy.Create("step","1")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      Link:function(caption,attrs,action)
      {
       var x,arg00,attrs1,el,arg20;
       x=AttrProxy.Concat(attrs);
       arg00=AttrProxy.Create("href","#");
       attrs1=AttrProxy.Append(arg00,x);
       el=Doc.Clickable("a",action);
       arg20=Doc.TextNode(caption);
       return Elt.New(el,attrs1,arg20);
      },
      LinkView:function(caption,attrs,view,action)
      {
       var evAttr,attrs1,arg00,arg20;
       evAttr=AttrModule.HandlerView("click",view,function()
       {
        return function()
        {
         return action;
        };
       });
       attrs1=AttrProxy.Concat(Seq.append([evAttr,AttrProxy.Create("href","#")],attrs));
       arg00=DomUtility.CreateElement("a");
       arg20=Doc.TextNode(caption);
       return Elt.New(arg00,attrs1,arg20);
      },
      Mk:function(node,updates)
      {
       return Doc.New(node,updates);
      },
      New:function(docNode,updates)
      {
       var r;
       r=Runtime.New(this,{});
       r.docNode=docNode;
       r.updates=updates;
       return r;
      },
      PasswordBox:function(attr,_var)
      {
       var arg10;
       arg10=function()
       {
        return Seq.append(attr,[AttrModule.Value(_var),AttrProxy.Create("type","password")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      Radio:function(attrs,value,_var)
      {
       var el,arg00,arg10,predView,valAttr,op_EqualsEqualsGreater,arg001,attr,arg20;
       el=DomUtility.CreateElement("input");
       el.addEventListener("click",function()
       {
        return _var.Set(value);
       },false);
       arg00=function(x)
       {
        return Unchecked.Equals(x,value);
       };
       arg10=_var.get_View();
       predView=View.Map(arg00,arg10);
       valAttr=AttrModule.DynamicProp("checked",predView);
       op_EqualsEqualsGreater=function(k,v)
       {
        return AttrProxy.Create(k,v);
       };
       arg001=List.append(List.ofArray([op_EqualsEqualsGreater("type","radio"),op_EqualsEqualsGreater("name",_var.get_Id()),valAttr]),List.ofSeq(attrs));
       attr=AttrProxy.Concat(arg001);
       arg20=Doc.get_Empty();
       return Elt.New(el,attr,arg20);
      },
      Run:function(parent,doc)
      {
       var d,st,p,arg10;
       d=doc.get_DocNode();
       Docs.LinkElement(parent,d);
       st=Docs.CreateRunState(parent,d);
       p=Mailbox.StartProcessor(function()
       {
        return Docs.PerformAnimatedUpdate(st,d);
       });
       arg10=doc.get_Updates();
       return View1.Sink(p,arg10);
      },
      RunAfter:function(ldelim,doc)
      {
       var rdelim,value;
       rdelim=document.createTextNode("");
       value=ldelim.parentNode.insertBefore(rdelim,ldelim.nextSibling);
       return Doc.RunBetween(ldelim,rdelim,doc);
      },
      RunAfterById:function(id,doc)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.RunAfter(matchValue,doc);
      },
      RunAppend:function(parent,doc)
      {
       var rdelim,value;
       rdelim=document.createTextNode("");
       value=parent.appendChild(rdelim);
       return Doc.RunBefore(rdelim,doc);
      },
      RunAppendById:function(id,doc)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.RunAppend(matchValue,doc);
      },
      RunBefore:function(rdelim,doc)
      {
       var ldelim,value;
       ldelim=document.createTextNode("");
       value=rdelim.parentNode.insertBefore(ldelim,rdelim);
       return Doc.RunBetween(ldelim,rdelim,doc);
      },
      RunBeforeById:function(id,doc)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.RunBefore(matchValue,doc);
      },
      RunBetween:function(ldelim,rdelim,doc)
      {
       var st,p,arg10;
       Docs.LinkPrevElement(rdelim,doc.get_DocNode());
       st=Docs.CreateDelimitedRunState(ldelim,rdelim,doc.get_DocNode());
       p=Mailbox.StartProcessor(function()
       {
        return Docs.PerformAnimatedUpdate(st,doc.get_DocNode());
       });
       arg10=doc.get_Updates();
       return View1.Sink(p,arg10);
      },
      RunById:function(id,tr)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.Run(matchValue,tr);
      },
      RunPrepend:function(parent,doc)
      {
       var rdelim,value;
       rdelim=document.createTextNode("");
       value=parent.insertBefore(rdelim,parent.firstChild);
       return Doc.RunBefore(rdelim,doc);
      },
      RunPrependById:function(id,doc)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.RunPrepend(matchValue,doc);
      },
      Select:function(attrs,show,options,current)
      {
       var arg20;
       arg20=View1.Const(options);
       return Doc.SelectDyn(attrs,show,arg20,current);
      },
      SelectDyn:function(attrs,show,vOptions,current)
      {
       var options,getIndex,getSelectedItem,itemIndex,setSelectedItem,el1,value,selectedItemAttr,onChange,arg00,x2,arg001,optionElements,arg102,x3,arg002,attrs1;
       options=[Runtime.New(T,{
        $:0
       })];
       getIndex=function(el)
       {
        return el.selectedIndex;
       };
       getSelectedItem=function(el)
       {
        var i;
        i=getIndex(el);
        return options[0].get_Item(i);
       };
       itemIndex=function(x)
       {
        return Seq.findIndex(function(y)
        {
         return Unchecked.Equals(x,y);
        },options[0]);
       };
       setSelectedItem=function(el)
       {
        return function(item)
        {
         var i;
         i=itemIndex(item);
         el.selectedIndex=i;
         return;
        };
       };
       el1=DomUtility.CreateElement("select");
       value=current.get_View();
       selectedItemAttr=AttrModule.DynamicCustom(setSelectedItem,value);
       onChange=function()
       {
        return current.UpdateMaybe(function(x1)
        {
         var y;
         y=getSelectedItem(el1);
         return Unchecked.Equals(x1,y)?{
          $:0
         }:{
          $:1,
          $0:y
         };
        });
       };
       el1.addEventListener("change",onChange,false);
       arg00=function(l)
       {
        var mapping;
        options[0]=l;
        mapping=function(i)
        {
         return function(x)
         {
          return[i,x];
         };
        };
        return Seq.mapi(mapping,l);
       };
       x2=View.Map(arg00,vOptions);
       arg001=function(tupledArg)
       {
        var i,o,t,arg10,arg101,arg20;
        i=tupledArg[0];
        o=tupledArg[1];
        t=Doc.TextNode(show(o));
        arg101=Global.String(i);
        arg10=List.ofArray([AttrProxy.Create("value",arg101)]);
        arg20=List.ofArray([t]);
        return Doc.Element("option",arg10,arg20);
       };
       optionElements=Doc.Convert(arg001,x2);
       arg102=AttrProxy.Concat(attrs);
       x3=AttrProxy.Append(selectedItemAttr,arg102);
       arg002=AttrModule.OnAfterRender(function(el)
       {
        return(setSelectedItem(el))(current.Get());
       });
       attrs1=AttrProxy.Append(arg002,x3);
       return Elt.New(el1,attrs1,optionElements);
      },
      SelectDynOptional:function(attrs,noneText,show,vOptions,current)
      {
       var arg10,arg00,arg20;
       arg10=function(_arg2)
       {
        var _,x;
        if(_arg2.$==1)
         {
          x=_arg2.$0;
          _=show(x);
         }
        else
         {
          _=noneText;
         }
        return _;
       };
       arg00=function(options)
       {
        return Runtime.New(T,{
         $:1,
         $0:{
          $:0
         },
         $1:List.map(function(arg0)
         {
          return{
           $:1,
           $0:arg0
          };
         },options)
        });
       };
       arg20=View.Map(arg00,vOptions);
       return Doc.SelectDyn(attrs,arg10,arg20,current);
      },
      SelectOptional:function(attrs,noneText,show,options,current)
      {
       var arg10,arg20;
       arg10=function(_arg1)
       {
        var _,x;
        if(_arg1.$==1)
         {
          x=_arg1.$0;
          _=show(x);
         }
        else
         {
          _=noneText;
         }
        return _;
       };
       arg20=Runtime.New(T,{
        $:1,
        $0:{
         $:0
        },
        $1:List.map(function(arg0)
        {
         return{
          $:1,
          $0:arg0
         };
        },options)
       });
       return Doc.Select(attrs,arg10,arg20,current);
      },
      Static:function(el)
      {
       var arg10,arg20;
       arg10=AttrProxy.get_Empty();
       arg20=Doc.get_Empty();
       return Elt.New(el,arg10,arg20);
      },
      SvgElement:function(name,attr,children)
      {
       var attr1,children1,arg00;
       attr1=AttrProxy.Concat(attr);
       children1=Doc.Concat(children);
       arg00=DomUtility.CreateSvgElement(name);
       return Elt.New(arg00,attr1,children1);
      },
      TextNode:function(v)
      {
       var arg00,arg10;
       arg00={
        $:5,
        $0:DomUtility.CreateText(v)
       };
       arg10=View1.Const(null);
       return Doc.Mk(arg00,arg10);
      },
      TextView:function(txt)
      {
       var node,arg00,x,arg001;
       node=Docs.CreateTextNode();
       arg00=function(t)
       {
        return Docs.UpdateTextNode(node,t);
       };
       x=View.Map(arg00,txt);
       arg001={
        $:4,
        $0:node
       };
       return Doc.Mk(arg001,x);
      },
      Verbatim:function(html)
      {
       var matchValue,a,elem,append,es,arg10;
       matchValue=jQuery.parseHTML(html);
       a=Unchecked.Equals(matchValue,null)?[]:matchValue;
       elem=function(e)
       {
        return{
         $:1,
         $0:Docs.CreateElemNode(e,AttrProxy.get_Empty(),{
          $:3
         })
        };
       };
       append=function(x)
       {
        return function(y)
        {
         return{
          $:0,
          $0:x,
          $1:y
         };
        };
       };
       es=Array1.MapReduce(elem,{
        $:3
       },append,a);
       arg10=View1.Const(null);
       return Doc.Mk(es,arg10);
      },
      get_Empty:function()
      {
       var arg00,arg10;
       arg00={
        $:3
       };
       arg10=View1.Const(null);
       return Doc.Mk(arg00,arg10);
      }
     }),
     DocElemNode:Runtime.Class({
      Equals:function(o)
      {
       return this.ElKey===o.ElKey;
      },
      GetHashCode:function()
      {
       return this.ElKey;
      }
     }),
     Docs:{
      ComputeChangeAnim:function(st,cur)
      {
       var arg00,relevant,arg001,arg101,arg002,mapping,array,x;
       arg00=function(n)
       {
        return Attrs.HasChangeAnim(n.Attr);
       };
       relevant=function(arg10)
       {
        return NodeSet.Filter(arg00,arg10);
       };
       arg001=relevant(st.PreviousNodes);
       arg101=relevant(cur);
       arg002=NodeSet.Intersect(arg001,arg101);
       mapping=function(n)
       {
        return Attrs.GetChangeAnim(n.Attr);
       };
       array=NodeSet.ToArray(arg002);
       x=Arrays.map(mapping,array);
       return An.Concat(x);
      },
      ComputeEnterAnim:function(st,cur)
      {
       var arg00,arg001,arg10,arg002,mapping,array,x;
       arg00=function(n)
       {
        return Attrs.HasEnterAnim(n.Attr);
       };
       arg001=st.PreviousNodes;
       arg10=NodeSet.Filter(arg00,cur);
       arg002=NodeSet.Except(arg001,arg10);
       mapping=function(n)
       {
        return Attrs.GetEnterAnim(n.Attr);
       };
       array=NodeSet.ToArray(arg002);
       x=Arrays.map(mapping,array);
       return An.Concat(x);
      },
      ComputeExitAnim:function(st,cur)
      {
       var arg00,mapping,arg10,arg101,arg001,array,arg002;
       arg00=function(n)
       {
        return Attrs.HasExitAnim(n.Attr);
       };
       mapping=function(n)
       {
        return Attrs.GetExitAnim(n.Attr);
       };
       arg10=st.PreviousNodes;
       arg101=NodeSet.Filter(arg00,arg10);
       arg001=NodeSet.Except(cur,arg101);
       array=NodeSet.ToArray(arg001);
       arg002=Arrays.map(mapping,array);
       return An.Concat(arg002);
      },
      CreateDelimitedElemNode:function(ldelim,rdelim,attr,children)
      {
       var el,attr1;
       el=ldelim.parentNode;
       Docs.LinkPrevElement(rdelim,children);
       attr1=Attrs.Insert(el,attr);
       return Runtime.New(DocElemNode,Runtime.DeleteEmptyFields({
        Attr:attr1,
        Children:children,
        Delimiters:[ldelim,rdelim],
        El:el,
        ElKey:Fresh.Int(),
        Render:Runtime.GetOptional(attr1.OnAfterRender).$0
       },["Render"]));
      },
      CreateDelimitedRunState:function(ldelim,rdelim,doc)
      {
       return{
        PreviousNodes:NodeSet.get_Empty(),
        Top:Docs.CreateDelimitedElemNode(ldelim,rdelim,AttrProxy.get_Empty(),doc)
       };
      },
      CreateElemNode:function(el,attr,children)
      {
       var attr1;
       Docs.LinkElement(el,children);
       attr1=Attrs.Insert(el,attr);
       return Runtime.New(DocElemNode,Runtime.DeleteEmptyFields({
        Attr:attr1,
        Children:children,
        El:el,
        ElKey:Fresh.Int(),
        Render:Runtime.GetOptional(attr1.OnAfterRender).$0
       },["Render"]));
      },
      CreateEmbedNode:function()
      {
       return{
        Current:{
         $:3
        },
        Dirty:false
       };
      },
      CreateRunState:function(parent,doc)
      {
       return{
        PreviousNodes:NodeSet.get_Empty(),
        Top:Docs.CreateElemNode(parent,AttrProxy.get_Empty(),doc)
       };
      },
      CreateTextNode:function()
      {
       return{
        Text:DomUtility.CreateText(""),
        Dirty:false,
        Value:""
       };
      },
      DoSyncElement:function(el)
      {
       var parent,ins,ch,arg00,arg10,arg101,parent1,arg001,arg102,matchValue,pos1,_2,rdelim,value;
       parent=el.El;
       ins=function(doc,pos)
       {
        var _,e,d,_1,t,t1,b,a;
        if(doc.$==1)
         {
          e=doc.$0;
          _={
           $:1,
           $0:e.El
          };
         }
        else
         {
          if(doc.$==2)
           {
            d=doc.$0;
            if(d.Dirty)
             {
              d.Dirty=false;
              _1=Docs.InsertDoc(parent,d.Current,pos);
             }
            else
             {
              _1=ins(d.Current,pos);
             }
            _=_1;
           }
          else
           {
            if(doc.$==3)
             {
              _=pos;
             }
            else
             {
              if(doc.$==4)
               {
                t=doc.$0;
                _={
                 $:1,
                 $0:t.Text
                };
               }
              else
               {
                if(doc.$==5)
                 {
                  t1=doc.$0;
                  _={
                   $:1,
                   $0:t1
                  };
                 }
                else
                 {
                  b=doc.$1;
                  a=doc.$0;
                  _=ins(a,ins(b,pos));
                 }
               }
             }
           }
         }
        return _;
       };
       ch=DomNodes.DocChildren(el);
       arg00=el.El;
       arg10=Runtime.GetOptional(el.Delimiters);
       arg101=DomNodes.Children(arg00,arg10);
       parent1=el.El;
       arg001=function(el1)
       {
        return DomUtility.RemoveNode(parent1,el1);
       };
       arg102=DomNodes.Except(ch,arg101);
       DomNodes.Iter(arg001,arg102);
       matchValue=Runtime.GetOptional(el.Delimiters);
       if(matchValue.$==1)
        {
         rdelim=matchValue.$0[1];
         _2={
          $:1,
          $0:rdelim
         };
        }
       else
        {
         _2={
          $:0
         };
        }
       pos1=_2;
       value=ins(el.Children,pos1);
       return;
      },
      DomNodes:Runtime.Class({},{
       Children:function(elem,delims)
       {
        var _,rdelim,ldelim,a,n,value,objectArg;
        if(delims.$==1)
         {
          rdelim=delims.$0[1];
          ldelim=delims.$0[0];
          a=Array.prototype.constructor.apply(Array,[]);
          n=ldelim.nextSibling;
          while(n!==rdelim)
           {
            value=a.push(n);
            n=n.nextSibling;
           }
          _=Runtime.New(DomNodes,{
           $:0,
           $0:a
          });
         }
        else
         {
          objectArg=elem.childNodes;
          _=Runtime.New(DomNodes,{
           $:0,
           $0:Arrays.init(elem.childNodes.length,function(arg00)
           {
            return objectArg[arg00];
           })
          });
         }
        return _;
       },
       DocChildren:function(node)
       {
        var q,loop;
        q=[];
        loop=function(doc)
        {
         var _,d,e,tn,t,b,a;
         if(doc.$==2)
          {
           d=doc.$0;
           _=loop(d.Current);
          }
         else
          {
           if(doc.$==1)
            {
             e=doc.$0;
             _=q.push(e.El);
            }
           else
            {
             if(doc.$==3)
              {
               _=null;
              }
             else
              {
               if(doc.$==5)
                {
                 tn=doc.$0;
                 _=q.push(tn);
                }
               else
                {
                 if(doc.$==4)
                  {
                   t=doc.$0;
                   _=q.push(t.Text);
                  }
                 else
                  {
                   b=doc.$1;
                   a=doc.$0;
                   loop(a);
                   _=loop(b);
                  }
                }
              }
            }
          }
         return _;
        };
        loop(node.Children);
        return Runtime.New(DomNodes,{
         $:0,
         $0:q.slice(0)
        });
       },
       Except:function(_arg2,_arg1)
       {
        var excluded,included,predicate,arg0;
        excluded=_arg2.$0;
        included=_arg1.$0;
        predicate=function(n)
        {
         var predicate1;
         predicate1=function(k)
         {
          return!(n===k);
         };
         return Seq.forall(predicate1,excluded);
        };
        arg0=Arrays.filter(predicate,included);
        return Runtime.New(DomNodes,{
         $:0,
         $0:arg0
        });
       },
       FoldBack:function(f,_arg4,z)
       {
        var ns;
        ns=_arg4.$0;
        return Arrays.foldBack(f,ns,z);
       },
       Iter:function(f,_arg3)
       {
        var ns;
        ns=_arg3.$0;
        return Arrays.iter(f,ns);
       }
      }),
      InsertDoc:function(parent,doc,pos)
      {
       var _,e,d,t,t1,b,a;
       if(doc.$==1)
        {
         e=doc.$0;
         _=Docs.InsertNode(parent,e.El,pos);
        }
       else
        {
         if(doc.$==2)
          {
           d=doc.$0;
           d.Dirty=false;
           _=Docs.InsertDoc(parent,d.Current,pos);
          }
         else
          {
           if(doc.$==3)
            {
             _=pos;
            }
           else
            {
             if(doc.$==4)
              {
               t=doc.$0;
               _=Docs.InsertNode(parent,t.Text,pos);
              }
             else
              {
               if(doc.$==5)
                {
                 t1=doc.$0;
                 _=Docs.InsertNode(parent,t1,pos);
                }
               else
                {
                 b=doc.$1;
                 a=doc.$0;
                 _=Docs.InsertDoc(parent,a,Docs.InsertDoc(parent,b,pos));
                }
              }
            }
          }
        }
       return _;
      },
      InsertNode:function(parent,node,pos)
      {
       DomUtility.InsertAt(parent,pos,node);
       return{
        $:1,
        $0:node
       };
      },
      LinkElement:function(el,children)
      {
       var value;
       value=Docs.InsertDoc(el,children,{
        $:0
       });
       return;
      },
      LinkPrevElement:function(el,children)
      {
       var value;
       value=Docs.InsertDoc(el.parentNode,children,{
        $:1,
        $0:el
       });
       return;
      },
      NodeSet:Runtime.Class({},{
       Except:function(_arg3,_arg2)
       {
        var excluded,included;
        excluded=_arg3.$0;
        included=_arg2.$0;
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSet.Except(excluded,included)
        });
       },
       Filter:function(f,_arg1)
       {
        var set;
        set=_arg1.$0;
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSet.Filter(f,set)
        });
       },
       FindAll:function(doc)
       {
        var q,loop;
        q=[];
        loop=function(node)
        {
         var _,b,a,el,em;
         if(node.$==0)
          {
           b=node.$1;
           a=node.$0;
           loop(a);
           _=loop(b);
          }
         else
          {
           if(node.$==1)
            {
             el=node.$0;
             q.push(el);
             _=loop(el.Children);
            }
           else
            {
             if(node.$==2)
              {
               em=node.$0;
               _=loop(em.Current);
              }
             else
              {
               _=null;
              }
            }
          }
         return _;
        };
        loop(doc);
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSetProxy.New(q.slice(0))
        });
       },
       Intersect:function(_arg5,_arg4)
       {
        var a,b;
        a=_arg5.$0;
        b=_arg4.$0;
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSet.Intersect(a,b)
        });
       },
       IsEmpty:function(_arg6)
       {
        var ns;
        ns=_arg6.$0;
        return ns.get_Count()===0;
       },
       ToArray:function(_arg7)
       {
        var ns;
        ns=_arg7.$0;
        return HashSet.ToArray(ns);
       },
       get_Empty:function()
       {
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSetProxy.New11()
        });
       }
      }),
      PerformAnimatedUpdate:function(st,doc)
      {
       return Concurrency.Delay(function()
       {
        var cur,change,enter,exit;
        cur=NodeSet.FindAll(doc);
        change=Docs.ComputeChangeAnim(st,cur);
        enter=Docs.ComputeEnterAnim(st,cur);
        exit=Docs.ComputeExitAnim(st,cur);
        return Concurrency.Bind(An.Play(An.Append(change,exit)),function()
        {
         Docs.SyncElemNode(st.Top);
         return Concurrency.Bind(An.Play(enter),function()
         {
          return Concurrency.Return(void(st.PreviousNodes=cur));
         });
        });
       });
      },
      Sync:function(doc)
      {
       var sync;
       sync=function(doc1)
       {
        var _,el,n,d,_1,b,a;
        if(doc1.$==1)
         {
          el=doc1.$0;
          Docs.SyncElement(el);
          _=sync(el.Children);
         }
        else
         {
          if(doc1.$==2)
           {
            n=doc1.$0;
            _=sync(n.Current);
           }
          else
           {
            if(doc1.$==3)
             {
              _=null;
             }
            else
             {
              if(doc1.$==5)
               {
                _=null;
               }
              else
               {
                if(doc1.$==4)
                 {
                  d=doc1.$0;
                  if(d.Dirty)
                   {
                    d.Text.nodeValue=d.Value;
                    _1=void(d.Dirty=false);
                   }
                  else
                   {
                    _1=null;
                   }
                  _=_1;
                 }
                else
                 {
                  b=doc1.$1;
                  a=doc1.$0;
                  sync(a);
                  _=sync(b);
                 }
               }
             }
           }
         }
        return _;
       };
       return sync(doc);
      },
      SyncElemNode:function(el)
      {
       Docs.SyncElement(el);
       return Docs.Sync(el.Children);
      },
      SyncElement:function(el)
      {
       var hasDirtyChildren,matchValue,_1,f;
       hasDirtyChildren=function(el1)
       {
        var dirty;
        dirty=function(doc)
        {
         var _,b,a,d;
         if(doc.$==0)
          {
           b=doc.$1;
           a=doc.$0;
           _=dirty(a)?true:dirty(b);
          }
         else
          {
           if(doc.$==2)
            {
             d=doc.$0;
             _=d.Dirty?true:dirty(d.Current);
            }
           else
            {
             _=false;
            }
          }
         return _;
        };
        return dirty(el1.Children);
       };
       Attrs.Sync(el.El,el.Attr);
       hasDirtyChildren(el)?Docs.DoSyncElement(el):null;
       matchValue=Runtime.GetOptional(el.Render);
       if(matchValue.$==1)
        {
         f=matchValue.$0;
         f(el.El);
         _1=void(delete el.Render);
        }
       else
        {
         _1=null;
        }
       return _1;
      },
      UpdateEmbedNode:function(node,upd)
      {
       node.Current=upd;
       node.Dirty=true;
       return;
      },
      UpdateTextNode:function(n,t)
      {
       n.Value=t;
       n.Dirty=true;
       return;
      }
     },
     DomUtility:{
      AddClass:function(element,cl)
      {
       var value;
       value=jQuery(element).addClass(cl);
       return;
      },
      AppendTo:function(ctx,node)
      {
       var value;
       value=ctx.appendChild(node);
       return;
      },
      Clear:function(ctx)
      {
       var value;
       while(ctx.hasChildNodes())
        {
         value=ctx.removeChild(ctx.firstChild);
        }
       return;
      },
      ClearAttrs:function(ctx)
      {
       var value;
       while(ctx.hasAttributes())
        {
         value=ctx.removeAttributeNode(ctx.attributes.item(0));
        }
       return;
      },
      CreateAttr:function(name,value)
      {
       var a;
       a=DomUtility.Doc().createAttribute(name);
       a.value=value;
       return a;
      },
      CreateElement:function(name)
      {
       return DomUtility.Doc().createElement(name);
      },
      CreateSvgElement:function(name)
      {
       return DomUtility.Doc().createElementNS("http://www.w3.org/2000/svg",name);
      },
      CreateText:function(s)
      {
       return DomUtility.Doc().createTextNode(s);
      },
      Doc:Runtime.Field(function()
      {
       return document;
      }),
      InsertAt:function(parent,pos,node)
      {
       var currentPos,canSkip,_,p2,matchValue1,_1,_2,n1,n2,_3,_4,marker,value,value1;
       currentPos=function(node1)
       {
        var matchValue;
        matchValue=node1.nextSibling;
        return Unchecked.Equals(matchValue,null)?{
         $:0
        }:{
         $:1,
         $0:matchValue
        };
       };
       if(node.parentNode===parent)
        {
         p2=currentPos(node);
         matchValue1=[pos,p2];
         if(matchValue1[0].$==1)
          {
           if(matchValue1[1].$==1)
            {
             n1=matchValue1[0].$0;
             n2=matchValue1[1].$0;
             _2=n1===n2;
            }
           else
            {
             _2=false;
            }
           _1=_2;
          }
         else
          {
           _1=matchValue1[1].$==0?true:false;
          }
         _=_1;
        }
       else
        {
         _=false;
        }
       canSkip=_;
       if(!canSkip)
        {
         if(pos.$==1)
          {
           marker=pos.$0;
           value=parent.insertBefore(node,marker);
           _4=void value;
          }
         else
          {
           value1=parent.appendChild(node);
           _4=void value1;
          }
         _3=_4;
        }
       else
        {
         _3=null;
        }
       return _3;
      },
      RemoveAttr:function(el,attrName)
      {
       return el.removeAttribute(attrName);
      },
      RemoveClass:function(element,cl)
      {
       var value;
       value=jQuery(element).removeClass(cl);
       return;
      },
      RemoveNode:function(parent,el)
      {
       var _,value;
       if(el.parentNode===parent)
        {
         value=parent.removeChild(el);
         _=void value;
        }
       else
        {
         _=null;
        }
       return _;
      },
      SetAttr:function(el,name,value)
      {
       return el.setAttribute(name,value);
      },
      SetProperty:function($target,$name,$value)
      {
       var $0=this,$this=this;
       return $target.setProperty($name,$value);
      },
      SetStyle:function(el,name,value)
      {
       return DomUtility.SetProperty(el.style,name,value);
      }
     },
     DoubleInterpolation:Runtime.Class({
      Interpolate:function(t,x,y)
      {
       return x+t*(y-x);
      }
     }),
     DynamicAttrNode:Runtime.Class({
      GetChangeAnim:function()
      {
       return An.get_Empty();
      },
      GetEnterAnim:function()
      {
       return An.get_Empty();
      },
      GetExitAnim:function()
      {
       return An.get_Empty();
      },
      Init:function(parent)
      {
       return this.init.call(null,parent);
      },
      Sync:function(parent)
      {
       var _;
       if(this.dirty)
        {
         (this.push.call(null,parent))(this.value);
         _=void(this.dirty=false);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Changed:function()
      {
       return this.updates;
      }
     },{
      New:function(view,init,push)
      {
       var r,arg00;
       r=Runtime.New(this,{});
       r.init=init;
       r.push=push;
       r.value=undefined;
       r.dirty=true;
       arg00=function(x)
       {
        r.value=x;
        r.dirty=true;
        return;
       };
       r.updates=View.Map(arg00,view);
       return r;
      }
     }),
     Easing:Runtime.Class({},{
      Custom:function(f)
      {
       return Runtime.New(Easing,{
        TransformTime:f
       });
      },
      get_CubicInOut:function()
      {
       return Easings.CubicInOut();
      }
     }),
     Easings:{
      CubicInOut:Runtime.Field(function()
      {
       var f;
       f=function(t)
       {
        var t2,t3;
        t2=t*t;
        t3=t2*t;
        return 3*t2-2*t3;
       };
       return Runtime.New(Easing,{
        TransformTime:f
       });
      })
     },
     Elt:Runtime.Class({
      AddClass:function($cls)
      {
       var $this=this;
       return $this.elt.className+=" "+$cls;
      },
      Append:function(doc)
      {
       var e,v,arg00,arg10,arg20,value;
       e=this.get_DocElemNode();
       e.Children={
        $:0,
        $0:e.Children,
        $1:doc.get_DocNode()
       };
       v=this.rvUpdates;
       arg00=function()
       {
        return function()
        {
         return null;
        };
       };
       arg10=Var.Get(this.rvUpdates);
       arg20=doc.get_Updates();
       Var1.Set(v,View.Map2(arg00,arg10,arg20));
       value=Docs.InsertDoc(this.elt,doc.get_DocNode(),{
        $:0
       });
       return;
      },
      Clear:function()
      {
       var value;
       this.get_DocElemNode().Children={
        $:3
       };
       Var1.Set(this.rvUpdates,View1.Const(null));
       while(this.elt.hasChildNodes())
        {
         value=this.elt.removeChild(this.elt.firstChild);
        }
       return;
      },
      GetAttribute:function(name)
      {
       return this.elt.getAttribute(name);
      },
      GetProperty:function(name)
      {
       return this.elt[name];
      },
      GetText:function()
      {
       return this.elt.textContent;
      },
      GetValue:function()
      {
       return this.elt.value;
      },
      HasAttribute:function(name)
      {
       return this.elt.hasAttribute(name);
      },
      HasClass:function(cls)
      {
       return(new RegExp("(\\s|^)"+cls+"(\\s|$)")).test(this.elt.className);
      },
      Html:function()
      {
       return this.elt.outerHTML;
      },
      Id:function()
      {
       return this.elt.id;
      },
      OnAfterRender:function(cb)
      {
       var matchValue,_,f;
       matchValue=Runtime.GetOptional(this.get_DocElemNode().Render);
       if(matchValue.$==1)
        {
         f=matchValue.$0;
         _={
          $:1,
          $0:function(el)
          {
           f(el);
           return cb(el);
          }
         };
        }
       else
        {
         _={
          $:1,
          $0:cb
         };
        }
       Runtime.SetOptional(this.get_DocElemNode(),"Render",_);
       return this;
      },
      OnAfterRenderView:function(view,cb)
      {
       var id,arg00,_this=this;
       id=Fresh.Id();
       arg00=function(x)
       {
        (_this.get_Element())[id]=x;
        return Doc.get_Empty();
       };
       this.Append(Doc.BindView(arg00,view));
       return _this.OnAfterRender(function(e)
       {
        return(cb(e))(e[id]);
       });
      },
      Prepend:function(doc)
      {
       var e,v,arg00,arg10,arg20,matchValue,pos,value;
       e=this.get_DocElemNode();
       e.Children={
        $:0,
        $0:doc.get_DocNode(),
        $1:e.Children
       };
       v=this.rvUpdates;
       arg00=function()
       {
        return function()
        {
         return null;
        };
       };
       arg10=Var.Get(this.rvUpdates);
       arg20=doc.get_Updates();
       Var1.Set(v,View.Map2(arg00,arg10,arg20));
       matchValue=this.elt.firstChild;
       pos=Unchecked.Equals(matchValue,null)?{
        $:0
       }:{
        $:1,
        $0:matchValue
       };
       value=Docs.InsertDoc(this.elt,doc.get_DocNode(),pos);
       return;
      },
      RemoveAttribute:function(name)
      {
       return this.elt.removeAttribute(name);
      },
      RemoveClass:function(cls)
      {
       this.elt.className=this.elt.className.replace(new RegExp("(\\s|^)"+cls+"(\\s|$)")," ");
      },
      SetAttribute:function(name,value)
      {
       return this.elt.setAttribute(name,value);
      },
      SetProperty:function(name,value)
      {
       this.elt[name]=value;
      },
      SetStyle:function(style,value)
      {
       this.elt.style[style]=value;
      },
      SetText:function(v)
      {
       this.get_DocElemNode().Children={
        $:3
       };
       Var1.Set(this.rvUpdates,View1.Const(null));
       this.elt.textContent=v;
       return;
      },
      SetValue:function(v)
      {
       this.elt.value=v;
      },
      get_DocElemNode:function()
      {
       var matchValue,_,e;
       matchValue=this.docNode1;
       if(matchValue.$==1)
        {
         e=matchValue.$0;
         _=e;
        }
       else
        {
         _=Operators.FailWith("Elt: Invalid docNode");
        }
       return _;
      },
      get_Element:function()
      {
       return this.elt;
      },
      on:function(ev,cb)
      {
       this.elt.addEventListener(ev,cb(this.elt),false);
       return this;
      },
      onView:function(ev,view,cb)
      {
       var id,arg00,_this=this;
       id=Fresh.Id();
       arg00=function(x)
       {
        (_this.get_Element())[id]=x;
        return Doc.get_Empty();
       };
       this.Append(Doc.BindView(arg00,view));
       _this.elt.addEventListener(ev,function(ev1)
       {
        return((cb(_this.elt))(ev1))(_this.elt[id]);
       },false);
       return _this;
      }
     },{
      New:function(el,attr,children)
      {
       var node,rvUpdates,attrUpdates,arg00,arg001,arg10,updates;
       node=Docs.CreateElemNode(el,attr,children.get_DocNode());
       rvUpdates=Var.Create(children.get_Updates());
       attrUpdates=Attrs.Updates(node.Attr);
       arg00=function()
       {
        return function()
        {
         return null;
        };
       };
       arg001=function(arg20)
       {
        return View.Map2(arg00,attrUpdates,arg20);
       };
       arg10=rvUpdates.get_View();
       updates=View1.Bind(arg001,arg10);
       return Elt.New1({
        $:1,
        $0:node
       },updates,el,rvUpdates,attrUpdates);
      },
      New1:function(docNode,updates,elt,rvUpdates)
      {
       var r;
       r=Runtime.New(this,Doc.New(docNode,updates));
       r.docNode1=docNode;
       r.elt=elt;
       r.rvUpdates=rvUpdates;
       return r;
      }
     }),
     Flow:Runtime.Class({},{
      Bind:function(m,k)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return(m.Render.call(null,_var))(function(r)
          {
           return(k(r).Render.call(null,_var))(cont);
          });
         };
        }
       };
      },
      Map:function(f,x)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return(x.Render.call(null,_var))(function(r)
          {
           return cont(f(r));
          });
         };
        }
       };
      },
      Return:function(x)
      {
       return{
        Render:function()
        {
         return function(cont)
         {
          return cont(x);
         };
        }
       };
      },
      get_Do:function()
      {
       return FlowBuilder.New();
      }
     }),
     Flow1:Runtime.Class({},{
      Define:function(f)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          var arg10;
          arg10=f(cont);
          return Var1.Set(_var,arg10);
         };
        }
       };
      },
      Embed:function(fl)
      {
       var _var;
       _var=Var.Create(Doc.get_Empty());
       (fl.Render.call(null,_var))(function()
       {
       });
       return Doc.EmbedView(_var.get_View());
      },
      Static:function(doc)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          Var1.Set(_var,doc);
          return cont(null);
         };
        }
       };
      }
     }),
     FlowBuilder:Runtime.Class({
      Bind:function(comp,func)
      {
       return Flow.Bind(comp,func);
      },
      Return:function(value)
      {
       return Flow.Return(value);
      },
      ReturnFrom:function(inner)
      {
       return inner;
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Html:{
      attr:Runtime.Class({},{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     Input:{
      ActivateButtonListener:Runtime.Field(function()
      {
       var _buttonListener_39_1,_1;
       _buttonListener_39_1=function(evt,down)
       {
        var matchValue,_,arg00,arg001,arg002;
        matchValue=evt.button;
        if(matchValue===0)
         {
          arg00=Input.MouseBtnSt1().Left;
          _=Var1.Set(arg00,down);
         }
        else
         {
          if(matchValue===1)
           {
            arg001=Input.MouseBtnSt1().Middle;
            _=Var1.Set(arg001,down);
           }
          else
           {
            if(matchValue===2)
             {
              arg002=Input.MouseBtnSt1().Right;
              _=Var1.Set(arg002,down);
             }
            else
             {
              _=null;
             }
           }
         }
        return _;
       };
       if(!Input.MouseBtnSt1().Active)
        {
         Input.MouseBtnSt1().Active=true;
         document.addEventListener("mousedown",function(evt)
         {
          return _buttonListener_39_1(evt,true);
         },false);
         _1=document.addEventListener("mouseup",function(evt)
         {
          return _buttonListener_39_1(evt,false);
         },false);
        }
       else
        {
         _1=null;
        }
       return _1;
      }),
      ActivateKeyListener:Runtime.Field(function()
      {
       var _,value,value1;
       if(!Input.KeyListenerState().KeyListenerActive)
        {
         value=jQuery(document).keydown(function(evt)
         {
          var keyCode,arg00,xs;
          keyCode=evt.which;
          arg00=Input.KeyListenerState().LastPressed;
          Var1.Set(arg00,keyCode);
          xs=Var.Get(Input.KeyListenerState().KeysPressed);
          return!Seq.exists(function(x)
          {
           return x===keyCode;
          },xs)?Var1.Set(Input.KeyListenerState().KeysPressed,List.append(xs,List.ofArray([keyCode]))):null;
         });
         value1=jQuery(document).keyup(function(evt)
         {
          var keyCode,arg00,predicate,arg10;
          keyCode=evt.which;
          arg00=Input.KeyListenerState().KeysPressed;
          predicate=function(x)
          {
           return x!==keyCode;
          };
          arg10=function(list)
          {
           return List.filter(predicate,list);
          };
          return Var1.Update(arg00,arg10);
         });
         _=void value1;
        }
       else
        {
         _=null;
        }
       return _;
      }),
      KeyListenerState:Runtime.Field(function()
      {
       return{
        KeysPressed:Var.Create(Runtime.New(T,{
         $:0
        })),
        KeyListenerActive:false,
        LastPressed:Var.Create(-1)
       };
      }),
      Keyboard:Runtime.Class({},{
       IsPressed:function(key)
       {
        var predicate;
        Input.ActivateKeyListener();
        predicate=function(x)
        {
         return x===key;
        };
        return View.Map(function(list)
        {
         return Seq.exists(predicate,list);
        },Input.KeyListenerState().KeysPressed.get_View());
       },
       get_KeysPressed:function()
       {
        Input.ActivateKeyListener();
        return Input.KeyListenerState().KeysPressed.get_View();
       },
       get_LastPressed:function()
       {
        Input.ActivateKeyListener();
        return Input.KeyListenerState().LastPressed.get_View();
       }
      }),
      Mouse:Runtime.Class({},{
       get_LeftPressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Left.get_View();
       },
       get_MiddlePressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Middle.get_View();
       },
       get_MousePressed:function()
       {
        Input.ActivateButtonListener();
        return View1.Apply(View1.Apply(View1.Apply(View1.Const(function(l)
        {
         return function(m)
         {
          return function(r)
          {
           return(l?true:m)?true:r;
          };
         };
        }),Input.MouseBtnSt1().Left.get_View()),Input.MouseBtnSt1().Middle.get_View()),Input.MouseBtnSt1().Right.get_View());
       },
       get_Position:function()
       {
        var onMouseMove,_;
        onMouseMove=function(evt)
        {
         var arg00,arg10;
         arg00=Input.MousePosSt1().PosV;
         arg10=[evt.clientX,evt.clientY];
         return Var1.Set(arg00,arg10);
        };
        if(!Input.MousePosSt1().Active)
         {
          document.addEventListener("mousemove",onMouseMove,false);
          _=void(Input.MousePosSt1().Active=true);
         }
        else
         {
          _=null;
         }
        return Input.MousePosSt1().PosV.get_View();
       },
       get_RightPressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Right.get_View();
       }
      }),
      MouseBtnSt1:Runtime.Field(function()
      {
       return{
        Active:false,
        Left:Var.Create(false),
        Middle:Var.Create(false),
        Right:Var.Create(false)
       };
      }),
      MousePosSt1:Runtime.Field(function()
      {
       return{
        Active:false,
        PosV:Var.Create([0,0])
       };
      })
     },
     Interpolation1:Runtime.Class({},{
      get_Double:function()
      {
       return Runtime.New(DoubleInterpolation,{
        $:0
       });
      }
     }),
     Key:Runtime.Class({},{
      Fresh:function()
      {
       return Runtime.New(Key,{
        $:0,
        $0:Fresh.Int()
       });
      }
     }),
     ListModel:Runtime.Class({
      Add:function(item)
      {
       var v,_,objectArg,index,m=this,objectArg1;
       v=this.Var.get_Value();
       if(!ListModels.Contains(this.get_Key(),item,v))
        {
         objectArg=this.Storage;
         _=this.Var.set_Value(objectArg.Add(item,v));
        }
       else
        {
         index=Arrays.findINdex(function(it)
         {
          return Unchecked.Equals((m.get_Key())(it),(m.get_Key())(item));
         },v);
         objectArg1=m.Storage;
         _=m.Var.set_Value(objectArg1.SetAt(index,item,v));
        }
       return _;
      },
      Clear:function()
      {
       return this.Var.set_Value(this.Storage.Set(Seq.empty()));
      },
      ContainsKey:function(key)
      {
       var m=this;
       return Seq.exists(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },m.Var.get_Value());
      },
      ContainsKeyAsView:function(key)
      {
       var predicate,m=this,arg00,arg10;
       predicate=function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       };
       arg00=function(array)
       {
        return Seq.exists(predicate,array);
       };
       arg10=m.Var.get_View();
       return View.Map(arg00,arg10);
      },
      Find:function(pred)
      {
       return Arrays.find(pred,this.Var.get_Value());
      },
      FindAsView:function(pred)
      {
       var arg00,arg10;
       arg00=function(array)
       {
        return Arrays.find(pred,array);
       };
       arg10=this.Var.get_View();
       return View.Map(arg00,arg10);
      },
      FindByKey:function(key)
      {
       var m=this;
       return Arrays.find(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },m.Var.get_Value());
      },
      FindByKeyAsView:function(key)
      {
       var predicate,m=this,arg00,arg10;
       predicate=function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       };
       arg00=function(array)
       {
        return Arrays.find(predicate,array);
       };
       arg10=m.Var.get_View();
       return View.Map(arg00,arg10);
      },
      Iter:function(fn)
      {
       return Arrays.iter(fn,this.Var.get_Value());
      },
      Lens:function(key)
      {
       var arg00,arg10;
       arg00=function(x)
       {
        return x;
       };
       arg10=function()
       {
        return function(x)
        {
         return x;
        };
       };
       return this.LensInto(arg00,arg10,key);
      },
      LensInto:function(get,update,key)
      {
       return RefImpl1.New(this,key,get,update);
      },
      Remove:function(item)
      {
       var v,_,keyFn,k,objectArg,arg00;
       v=this.Var.get_Value();
       if(ListModels.Contains(this.key,item,v))
        {
         keyFn=this.key;
         k=keyFn(item);
         objectArg=this.Storage;
         arg00=function(i)
         {
          return!Unchecked.Equals(keyFn(i),k);
         };
         _=this.Var.set_Value(objectArg.RemoveIf(arg00,v));
        }
       else
        {
         _=null;
        }
       return _;
      },
      RemoveBy:function(f)
      {
       var objectArg,arg00,arg10;
       objectArg=this.Storage;
       arg00=function(x)
       {
        var value;
        value=f(x);
        return!value;
       };
       arg10=this.Var.get_Value();
       return this.Var.set_Value(objectArg.RemoveIf(arg00,arg10));
      },
      RemoveByKey:function(key)
      {
       var objectArg,arg00,m=this,arg10;
       objectArg=this.Storage;
       arg00=function(i)
       {
        return!Unchecked.Equals((m.get_Key())(i),key);
       };
       arg10=m.Var.get_Value();
       return this.Var.set_Value(objectArg.RemoveIf(arg00,arg10));
      },
      Set:function(lst)
      {
       return this.Var.set_Value(this.Storage.Set(lst));
      },
      TryFind:function(pred)
      {
       return Arrays.tryFind(pred,this.Var.get_Value());
      },
      TryFindAsView:function(pred)
      {
       var arg00,arg10;
       arg00=function(array)
       {
        return Arrays.tryFind(pred,array);
       };
       arg10=this.Var.get_View();
       return View.Map(arg00,arg10);
      },
      TryFindByKey:function(key)
      {
       var m=this;
       return Arrays.tryFind(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },m.Var.get_Value());
      },
      TryFindByKeyAsView:function(key)
      {
       var predicate,m=this,arg00,arg10;
       predicate=function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       };
       arg00=function(array)
       {
        return Arrays.tryFind(predicate,array);
       };
       arg10=m.Var.get_View();
       return View.Map(arg00,arg10);
      },
      UpdateAll:function(fn)
      {
       var objectArg,arg00,m=this;
       objectArg=this.Var;
       arg00=function(a)
       {
        var action;
        action=function(i)
        {
         return function(x)
         {
          var action1,option;
          action1=function(y)
          {
           return Arrays.set(a,i,y);
          };
          option=fn(x);
          return Option.iter(action1,option);
         };
        };
        Arrays.iteri(action,a);
        return m.Storage.Set(a);
       };
       return objectArg.Update(arg00);
      },
      UpdateBy:function(fn,key)
      {
       var v,matchValue,m=this,_,index,matchValue1,_1,value,objectArg;
       v=this.Var.get_Value();
       matchValue=Arrays.tryFindIndex(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },v);
       if(matchValue.$==1)
        {
         index=matchValue.$0;
         matchValue1=fn(Arrays.get(v,index));
         if(matchValue1.$==1)
          {
           value=matchValue1.$0;
           objectArg=m.Storage;
           _1=m.Var.set_Value(objectArg.SetAt(index,value,v));
          }
         else
          {
           _1=null;
          }
         _=_1;
        }
       else
        {
         _=null;
        }
       return _;
      },
      Wrap:function(extract,wrap,update)
      {
       return ListModel1.Wrap(this,extract,wrap,update);
      },
      get_Key:function()
      {
       return this.key;
      },
      get_Length:function()
      {
       return Arrays.length(this.Var.get_Value());
      },
      get_LengthAsView:function()
      {
       var arg00,arg10;
       arg00=function(arr)
       {
        return Arrays.length(arr);
       };
       arg10=this.Var.get_View();
       return View.Map(arg00,arg10);
      },
      get_View:function()
      {
       return this.view;
      }
     },{
      Create:function(key,init)
      {
       var _arg00_,arg10;
       _arg00_=Seq.toArray(init);
       arg10=Storage1.InMemory(_arg00_);
       return ListModel.CreateWithStorage(key,arg10);
      },
      CreateWithStorage:function(key,storage)
      {
       var source,arg00,_var,arg001,arg10,view;
       source=Seq1.distinctBy(key,storage.Init());
       arg00=Seq.toArray(source);
       _var=Var.Create(arg00);
       arg001=function(x)
       {
        var value;
        value=storage.Set(x);
        return x.slice();
       };
       arg10=_var.get_View();
       view=View.Map(arg001,arg10);
       return Runtime.New(ListModel,{
        key:key,
        Var:_var,
        Storage:storage,
        view:view
       });
      }
     }),
     ListModel1:Runtime.Class({},{
      FromSeq:function(init)
      {
       var arg00;
       arg00=function(x)
       {
        return x;
       };
       return ListModel.Create(arg00,init);
      },
      Key:function(m)
      {
       return m.key;
      },
      View:function(m)
      {
       return m.view;
      },
      Wrap:function(underlying,extract,createItem,updateItem)
      {
       var state,mapping,array,init,objectArg,arg00,arg10,_var,g;
       state=[Dictionary.New12()];
       mapping=function(u)
       {
        var t;
        t=createItem(u);
        state[0].set_Item((underlying.get_Key())(u),t);
        return t;
       };
       array=underlying.Var.get_Value();
       init=Arrays.map(mapping,array);
       objectArg=underlying.Var;
       arg00=function(us)
       {
        var newState,mapping1,ts;
        newState=Dictionary.New12();
        mapping1=function(u)
        {
         var k,t;
         k=(underlying.get_Key())(u);
         t=state[0].ContainsKey(k)?(updateItem(state[0].get_Item(k)))(u):createItem(u);
         newState.set_Item(k,t);
         return t;
        };
        ts=Arrays.map(mapping1,us);
        state[0]=newState;
        return ts;
       };
       arg10=function()
       {
        return function(ts)
        {
         var newState,mapping1,us1;
         newState=Dictionary.New12();
         mapping1=function(t)
         {
          var u;
          u=extract(t);
          newState.set_Item((underlying.get_Key())(u),t);
          return u;
         };
         us1=Arrays.map(mapping1,ts);
         state[0]=newState;
         return us1;
        };
       };
       _var=Var1.Lens(objectArg,arg00,arg10);
       g=underlying.get_Key();
       return Runtime.New(ListModel,{
        key:function(x)
        {
         return g(extract(x));
        },
        Var:_var,
        Storage:Storage1.InMemory(init),
        view:View.Map(function(source)
        {
         return source;
        },_var.get_View())
       });
      }
     }),
     ListModels:{
      Contains:function(keyFn,item,xs)
      {
       var t;
       t=keyFn(item);
       return Seq.exists(function(it)
       {
        return Unchecked.Equals(keyFn(it),t);
       },xs);
      }
     },
     Model:Runtime.Class({
      get_View:function()
      {
       return Model1.View(this);
      }
     },{
      Create:function(proj,init)
      {
       var _var,arg10,view;
       _var=Var.Create(init);
       arg10=_var.get_View();
       view=View.Map(proj,arg10);
       return Runtime.New(Model,{
        $:0,
        $0:_var,
        $1:view
       });
      },
      Update:function(update,_arg1)
      {
       var _var,arg10;
       _var=_arg1.$0;
       arg10=function(x)
       {
        update(x);
        return x;
       };
       return Var1.Update(_var,arg10);
      }
     }),
     Model1:Runtime.Class({},{
      View:function(_arg2)
      {
       var view;
       view=_arg2.$1;
       return view;
      }
     }),
     ReactiveExtensions:Runtime.Class({},{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     RefImpl:Runtime.Class({
      Get:function()
      {
       return this.get.call(null,this.baseRef.Get());
      },
      Set:function(v)
      {
       var _this=this;
       return this.baseRef.Update(function(t)
       {
        return(_this.update.call(null,t))(v);
       });
      },
      Update:function(f)
      {
       var _this=this;
       return this.baseRef.Update(function(t)
       {
        return(_this.update.call(null,t))(f(_this.get.call(null,t)));
       });
      },
      UpdateMaybe:function(f)
      {
       var _this=this;
       return this.baseRef.UpdateMaybe(function(t)
       {
        return Option.map(_this.update.call(null,t),f(_this.get.call(null,t)));
       });
      },
      get_Id:function()
      {
       return this.id;
      },
      get_Value:function()
      {
       return this.get.call(null,this.baseRef.Get());
      },
      get_View:function()
      {
       var arg00,arg10;
       arg00=this.get;
       arg10=this.baseRef.get_View();
       return View.Map(arg00,arg10);
      },
      set_Value:function(v)
      {
       var _this=this;
       return this.baseRef.Update(function(t)
       {
        return(_this.update.call(null,t))(v);
       });
      }
     },{
      New:function(baseRef,get,update)
      {
       var r;
       r=Runtime.New(this,{});
       r.baseRef=baseRef;
       r.get=get;
       r.update=update;
       r.id=Fresh.Id();
       return r;
      }
     }),
     RefImpl1:Runtime.Class({
      Get:function()
      {
       return this.get.call(null,this.m.FindByKey(this.key));
      },
      Set:function(v)
      {
       var objectArg,arg00,r=this,arg10;
       objectArg=this.m;
       arg00=function(i)
       {
        return{
         $:1,
         $0:(r.update.call(null,i))(v)
        };
       };
       arg10=r.key;
       return objectArg.UpdateBy(arg00,arg10);
      },
      Update:function(f)
      {
       var objectArg,arg00,r=this,arg10;
       objectArg=this.m;
       arg00=function(i)
       {
        return{
         $:1,
         $0:(r.update.call(null,i))(f(r.get.call(null,i)))
        };
       };
       arg10=r.key;
       return objectArg.UpdateBy(arg00,arg10);
      },
      UpdateMaybe:function(f)
      {
       var objectArg,arg00,r=this,arg10;
       objectArg=this.m;
       arg00=function(i)
       {
        return Option.map(r.update.call(null,i),f(r.get.call(null,i)));
       };
       arg10=r.key;
       return objectArg.UpdateBy(arg00,arg10);
      },
      get_Id:function()
      {
       return this.id;
      },
      get_Value:function()
      {
       return this.Get();
      },
      get_View:function()
      {
       var arg00,arg10;
       arg00=this.get;
       arg10=this.m.FindByKeyAsView(this.key);
       return View.Map(arg00,arg10);
      },
      set_Value:function(v)
      {
       return this.Set(v);
      }
     },{
      New:function(m,key,get,update)
      {
       var r;
       r=Runtime.New(this,{});
       r.m=m;
       r.key=key;
       r.get=get;
       r.update=update;
       r.id=Fresh.Id();
       return r;
      }
     }),
     Route:{
      Append:function(_arg2,_arg1)
      {
       var a,b;
       a=_arg2.$0;
       b=_arg1.$0;
       return{
        $:0,
        $0:AppendList1.Append(a,b)
       };
      },
      FromList:function(xs)
      {
       var _arg00_,arg0;
       _arg00_=Arrays.ofSeq(xs);
       arg0=AppendList1.FromArray(_arg00_);
       return{
        $:0,
        $0:arg0
       };
      },
      MakeHash:function(_arg1)
      {
       var x,array,strings;
       x=_arg1.$0;
       array=AppendList1.ToArray(x);
       strings=Arrays.map(function(x1)
       {
        return encodeURIComponent(x1);
       },array);
       return Strings.concat("/",strings);
      },
      NoHash:function(s)
      {
       return Strings.StartsWith(s,"#")?s.substring(1):s;
      },
      ParseHash:function(hash)
      {
       var array,_arg00_,arg0;
       array=Strings.SplitChars(Route.NoHash(hash),[47],1);
       _arg00_=Arrays.map(function(x)
       {
        return decodeURIComponent(x);
       },array);
       arg0=AppendList1.FromArray(_arg00_);
       return{
        $:0,
        $0:arg0
       };
      },
      SameHash:function(a,b)
      {
       return Route.NoHash(a)===Route.NoHash(b);
      },
      ToList:function(_arg1)
      {
       var rt,array;
       rt=_arg1.$0;
       array=AppendList1.ToArray(rt);
       return List.ofArray(array);
      }
     },
     RouteMap1:Runtime.Class({},{
      Create:function(ser,des)
      {
       return{
        Des:des,
        Ser:ser
       };
      },
      Install:function(map)
      {
       return Routing.InstallMap(map);
      }
     }),
     Router:Runtime.Class({},{
      Dir:function(prefix,sites)
      {
       var arg10;
       arg10=Router.Merge(sites);
       return Router.Prefix(prefix,arg10);
      },
      Install:function(key,site)
      {
       return Routing.Install(key,site);
      },
      Merge:function(sites)
      {
       return Routing.MergeRouters(sites);
      },
      Prefix:function(prefix,_arg1)
      {
       var va,tree;
       va=_arg1.$0;
       tree=_arg1.$1;
       return{
        $:0,
        $0:va,
        $1:Trie1.Prefix(prefix,tree)
       };
      }
     }),
     Router1:Runtime.Class({},{
      Route:function(r,init,render)
      {
       return Routing.DefineRoute(r,init,render);
      }
     }),
     Routing:{
      ComputeBodies:function(trie)
      {
       var d,action,array;
       d=Dictionary.New12();
       action=function(body)
       {
        return d.set_Item(body.RouteId,body);
       };
       array=Trie1.ToArray(trie);
       Arrays.iter(action,array);
       return d;
      },
      DefineRoute:function(r,init,render)
      {
       var state,id,site,t;
       state=Var.Create(init);
       id=Fresh.Int();
       site=(render({
        $:0,
        $0:id
       }))(state);
       t=Trie1.Leaf({
        $:0,
        $0:id,
        $1:function(ctx)
        {
         var arg00,arg10;
         arg00=function(va)
         {
          return ctx.UpdateRoute.call(null,Routing.DoLink(r,va));
         };
         arg10=state.get_View();
         View1.Sink(arg00,arg10);
         return{
          OnRouteChanged:function(route)
          {
           return Var1.Set(state,Routing.DoRoute(r,route));
          },
          OnSelect:function()
          {
           return ctx.UpdateRoute.call(null,Routing.DoLink(r,Var.Get(state)));
          },
          RouteId:id,
          RouteValue:site
         };
        }
       });
       return{
        $:0,
        $0:{
         $:1,
         $0:site
        },
        $1:t
       };
      },
      DoLink:function(map,va)
      {
       return Route.FromList(map.Ser.call(null,va));
      },
      DoRoute:function(map,route)
      {
       return map.Des.call(null,Route.ToList(route));
      },
      Install:function(key,_arg1)
      {
       var va,site,currentRoute,state,_arg00_1,siteTrie,parseRoute,matchValue,glob,_,site1,arg00,_1,v,arg001,arg10,updateRoute,arg101;
       va=_arg1.$0;
       site=_arg1.$1;
       currentRoute=Routing.InstallMap({
        Des:function(xs)
        {
         return Route.FromList(xs);
        },
        Ser:function(_arg00_)
        {
         return Route.ToList(_arg00_);
        }
       });
       state={
        Bodies:undefined,
        CurrentRoute:currentRoute,
        CurrentSite:0,
        Selection:undefined
       };
       _arg00_1=function(prefix)
       {
        return function(_arg11)
        {
         var init,id;
         init=_arg11.$1;
         id=_arg11.$0;
         return init({
          UpdateRoute:function(rest)
          {
           return Routing.OnInternalSiteUpdate(state,id,prefix,rest);
          }
         });
        };
       };
       siteTrie=Trie1.Map(_arg00_1,site);
       state.Bodies=Routing.ComputeBodies(siteTrie);
       parseRoute=function(route)
       {
        return Trie1.Lookup(siteTrie,Route.ToList(route));
       };
       matchValue=parseRoute(Var.Get(currentRoute));
       if(matchValue.$==0)
        {
         site1=matchValue.$0;
         matchValue.$1;
         state.CurrentSite=site1.RouteId;
         _=Var.Create(site1.RouteValue);
        }
       else
        {
         if(va.$==1)
          {
           v=va.$0;
           _1=v;
          }
         else
          {
           _1=Operators.FailWith("Site.Install fails on empty site");
          }
         arg00=_1;
         _=Var.Create(arg00);
        }
       glob=_;
       state.Selection=glob;
       arg001=function(site2)
       {
        return Routing.OnSelectSite(state,key(site2));
       };
       arg10=glob.get_View();
       View1.Sink(arg001,arg10);
       updateRoute=function(route)
       {
        var matchValue1,_2,site2,rest,rest1;
        matchValue1=parseRoute(route);
        if(matchValue1.$==1)
         {
          _2=null;
         }
        else
         {
          site2=matchValue1.$0;
          rest=matchValue1.$1;
          rest1=Route.FromList(rest);
          _2=Routing.OnGlobalRouteChange(state,site2,rest1);
         }
        return _2;
       };
       updateRoute(Var.Get(currentRoute));
       arg101=currentRoute.get_View();
       View1.Sink(updateRoute,arg101);
       return glob;
      },
      InstallMap:function(rt)
      {
       var cur,_var,set,onUpdate,arg00,arg10;
       cur=function()
       {
        var _arg00_;
        _arg00_=Route.ParseHash(window.location.hash);
        return rt.Des.call(null,Route.ToList(_arg00_));
       };
       _var=Var.Create(cur(null));
       set=function(value)
       {
        var a;
        a=Var.Get(_var);
        return!Unchecked.Equals(rt.Ser.call(null,a),rt.Ser.call(null,value))?Var1.Set(_var,value):null;
       };
       onUpdate=function()
       {
        return set(cur(null));
       };
       window.onpopstate=onUpdate;
       window.onhashchange=onUpdate;
       arg00=function(loc)
       {
        var ha;
        ha=Route.MakeHash(Route.FromList(rt.Ser.call(null,loc)));
        return!Route.SameHash(window.location.hash,ha)?void(window.location.hash=ha):null;
       };
       arg10=_var.get_View();
       View1.Sink(arg00,arg10);
       return _var;
      },
      MergeRouters:function(sites)
      {
       var sites1,mapping,_arg00_,merged,chooser,value,_,t1;
       sites1=Seq.toArray(sites);
       mapping=function(_arg1)
       {
        var t;
        t=_arg1.$1;
        return t;
       };
       _arg00_=Seq.map(mapping,sites1);
       merged=Trie1.Merge(_arg00_);
       chooser=function(_arg2)
       {
        var x;
        x=_arg2.$0;
        return x;
       };
       value=Seq.tryPick(chooser,sites1);
       if(merged.$==1)
        {
         t1=merged.$0;
         _={
          $:0,
          $0:value,
          $1:t1
         };
        }
       else
        {
         _=Operators.FailWith("Invalid Site.Merge: need more prefix disambiguation");
        }
       return _;
      },
      OnGlobalRouteChange:function(state,site,rest)
      {
       var _;
       if(state.CurrentSite!==site.RouteId)
        {
         state.CurrentSite=site.RouteId;
         _=Var1.Set(state.Selection,site.RouteValue);
        }
       else
        {
         _=null;
        }
       return site.OnRouteChanged.call(null,rest);
      },
      OnInternalSiteUpdate:function(state,ix,prefix,rest)
      {
       var _,route;
       if(state.CurrentSite===ix)
        {
         route=Route.Append(Route.FromList(prefix),rest);
         _=Routing.SetCurrentRoute(state,route);
        }
       else
        {
         _=null;
        }
       return _;
      },
      OnSelectSite:function(state,_arg1)
      {
       var id,_;
       id=_arg1.$0;
       if(state.CurrentSite!==id)
        {
         state.CurrentSite=id;
         _=state.Bodies.get_Item(id).OnSelect.call(null,null);
        }
       else
        {
         _=null;
        }
       return _;
      },
      SetCurrentRoute:function(state,route)
      {
       return!Unchecked.Equals(Var.Get(state.CurrentRoute),route)?Var1.Set(state.CurrentRoute,route):null;
      }
     },
     Snap1:{
      Bind:function(f,snap)
      {
       var res,onObs,onReady;
       res=Snap1.Create();
       onObs=function()
       {
        return Snap1.MarkObsolete(res);
       };
       onReady=function(x)
       {
        var y;
        y=f(x);
        return Snap1.When(y,function(v)
        {
         return(Snap1.IsForever(y)?Snap1.IsForever(snap):false)?Snap1.MarkForever(res,v):Snap1.MarkReady(res,v);
        },onObs);
       };
       Snap1.When(snap,onReady,onObs);
       return res;
      },
      Create:function()
      {
       return Snap1.Make({
        $:3,
        $0:[],
        $1:[]
       });
      },
      CreateForever:function(v)
      {
       return Snap1.Make({
        $:0,
        $0:v
       });
      },
      CreateForeverAsync:function(a)
      {
       var o,arg00;
       o=Snap1.Make({
        $:3,
        $0:[],
        $1:[]
       });
       arg00=Concurrency.Delay(function()
       {
        return Concurrency.Bind(a,function(_arg1)
        {
         return Concurrency.Return(Snap1.MarkForever(o,_arg1));
        });
       });
       Concurrency.Start(arg00,{
        $:0
       });
       return o;
      },
      CreateWithValue:function(v)
      {
       return Snap1.Make({
        $:2,
        $0:v,
        $1:[]
       });
      },
      IsForever:function(snap)
      {
       var matchValue;
       matchValue=snap.State;
       return matchValue.$==0?true:false;
      },
      IsObsolete:function(snap)
      {
       var matchValue;
       matchValue=snap.State;
       return matchValue.$==1?true:false;
      },
      Make:function(st)
      {
       return{
        State:st
       };
      },
      Map:function(fn,sn)
      {
       var matchValue,_,x,res;
       matchValue=sn.State;
       if(matchValue.$==0)
        {
         x=matchValue.$0;
         _=Snap1.CreateForever(fn(x));
        }
       else
        {
         res=Snap1.Create();
         Snap1.When(sn,function(x1)
         {
          var v;
          v=fn(x1);
          return Snap1.MarkDone(res,sn,v);
         },function()
         {
          return Snap1.MarkObsolete(res);
         });
         _=res;
        }
       return _;
      },
      Map2:function(fn,sn1,sn2)
      {
       var matchValue,_,_1,x,y,x1,_2,y1,res,v1,v2,obs,cont;
       matchValue=[sn1.State,sn2.State];
       if(matchValue[0].$==0)
        {
         if(matchValue[1].$==0)
          {
           x=matchValue[0].$0;
           y=matchValue[1].$0;
           _1=Snap1.CreateForever((fn(x))(y));
          }
         else
          {
           x1=matchValue[0].$0;
           _1=Snap1.Map(fn(x1),sn2);
          }
         _=_1;
        }
       else
        {
         if(matchValue[1].$==0)
          {
           y1=matchValue[1].$0;
           _2=Snap1.Map(function(x2)
           {
            return(fn(x2))(y1);
           },sn1);
          }
         else
          {
           res=Snap1.Create();
           v1=[{
            $:0
           }];
           v2=[{
            $:0
           }];
           obs=function()
           {
            v1[0]={
             $:0
            };
            v2[0]={
             $:0
            };
            return Snap1.MarkObsolete(res);
           };
           cont=function()
           {
            var matchValue1,_3,_4,x2,y2;
            matchValue1=[v1[0],v2[0]];
            if(matchValue1[0].$==1)
             {
              if(matchValue1[1].$==1)
               {
                x2=matchValue1[0].$0;
                y2=matchValue1[1].$0;
                _4=(Snap1.IsForever(sn1)?Snap1.IsForever(sn2):false)?Snap1.MarkForever(res,(fn(x2))(y2)):Snap1.MarkReady(res,(fn(x2))(y2));
               }
              else
               {
                _4=null;
               }
              _3=_4;
             }
            else
             {
              _3=null;
             }
            return _3;
           };
           Snap1.When(sn1,function(x2)
           {
            v1[0]={
             $:1,
             $0:x2
            };
            return cont(null);
           },obs);
           Snap1.When(sn2,function(y2)
           {
            v2[0]={
             $:1,
             $0:y2
            };
            return cont(null);
           },obs);
           _2=res;
          }
         _=_2;
        }
       return _;
      },
      Map3:function(fn,sn1,sn2,sn3)
      {
       var matchValue,_,_1,_2,x,y,z,x1,y1,_3,x2,z2,x3,_4,_5,y3,z3,y4,_6,z4,res,v1,v2,v3,obs,cont;
       matchValue=[sn1.State,sn2.State,sn3.State];
       if(matchValue[0].$==0)
        {
         if(matchValue[1].$==0)
          {
           if(matchValue[2].$==0)
            {
             x=matchValue[0].$0;
             y=matchValue[1].$0;
             z=matchValue[2].$0;
             _2=Snap1.CreateForever(((fn(x))(y))(z));
            }
           else
            {
             x1=matchValue[0].$0;
             y1=matchValue[1].$0;
             _2=Snap1.Map(function(z1)
             {
              return((fn(x1))(y1))(z1);
             },sn3);
            }
           _1=_2;
          }
         else
          {
           if(matchValue[2].$==0)
            {
             x2=matchValue[0].$0;
             z2=matchValue[2].$0;
             _3=Snap1.Map(function(y2)
             {
              return((fn(x2))(y2))(z2);
             },sn2);
            }
           else
            {
             x3=matchValue[0].$0;
             _3=Snap1.Map2(function(y2)
             {
              return function(z1)
              {
               return((fn(x3))(y2))(z1);
              };
             },sn2,sn3);
            }
           _1=_3;
          }
         _=_1;
        }
       else
        {
         if(matchValue[1].$==0)
          {
           if(matchValue[2].$==0)
            {
             y3=matchValue[1].$0;
             z3=matchValue[2].$0;
             _5=Snap1.Map(function(x4)
             {
              return((fn(x4))(y3))(z3);
             },sn1);
            }
           else
            {
             y4=matchValue[1].$0;
             _5=Snap1.Map2(function(x4)
             {
              return function(z1)
              {
               return((fn(x4))(y4))(z1);
              };
             },sn1,sn3);
            }
           _4=_5;
          }
         else
          {
           if(matchValue[2].$==0)
            {
             z4=matchValue[2].$0;
             _6=Snap1.Map2(function(x4)
             {
              return function(y2)
              {
               return((fn(x4))(y2))(z4);
              };
             },sn1,sn2);
            }
           else
            {
             res=Snap1.Create();
             v1=[{
              $:0
             }];
             v2=[{
              $:0
             }];
             v3=[{
              $:0
             }];
             obs=function()
             {
              v1[0]={
               $:0
              };
              v2[0]={
               $:0
              };
              v3[0]={
               $:0
              };
              return Snap1.MarkObsolete(res);
             };
             cont=function()
             {
              var matchValue1,_7,_8,_9,x4,y2,z1;
              matchValue1=[v1[0],v2[0],v3[0]];
              if(matchValue1[0].$==1)
               {
                if(matchValue1[1].$==1)
                 {
                  if(matchValue1[2].$==1)
                   {
                    x4=matchValue1[0].$0;
                    y2=matchValue1[1].$0;
                    z1=matchValue1[2].$0;
                    _9=((Snap1.IsForever(sn1)?Snap1.IsForever(sn2):false)?Snap1.IsForever(sn3):false)?Snap1.MarkForever(res,((fn(x4))(y2))(z1)):Snap1.MarkReady(res,((fn(x4))(y2))(z1));
                   }
                  else
                   {
                    _9=null;
                   }
                  _8=_9;
                 }
                else
                 {
                  _8=null;
                 }
                _7=_8;
               }
              else
               {
                _7=null;
               }
              return _7;
             };
             Snap1.When(sn1,function(x4)
             {
              v1[0]={
               $:1,
               $0:x4
              };
              return cont(null);
             },obs);
             Snap1.When(sn2,function(y2)
             {
              v2[0]={
               $:1,
               $0:y2
              };
              return cont(null);
             },obs);
             Snap1.When(sn3,function(z1)
             {
              v3[0]={
               $:1,
               $0:z1
              };
              return cont(null);
             },obs);
             _6=res;
            }
           _4=_6;
          }
         _=_4;
        }
       return _;
      },
      MapAsync:function(fn,snap)
      {
       var res;
       res=Snap1.Create();
       Snap1.When(snap,function(v)
       {
        return Async.StartTo(fn(v),function(v1)
        {
         return Snap1.MarkDone(res,snap,v1);
        });
       },function()
       {
        return Snap1.MarkObsolete(res);
       });
       return res;
      },
      MapCached:function(prev,fn,sn)
      {
       var fn1;
       fn1=function(x)
       {
        var matchValue,_,_x_,_1,y,y1,y2;
        matchValue=prev[0];
        if(matchValue.$==1)
         {
          matchValue.$0[1];
          _x_=matchValue.$0[0];
          if(Unchecked.Equals(x,_x_))
           {
            matchValue.$0[0];
            y=matchValue.$0[1];
            _1=y;
           }
          else
           {
            y1=fn(x);
            prev[0]={
             $:1,
             $0:[x,y1]
            };
            _1=y1;
           }
          _=_1;
         }
        else
         {
          y2=fn(x);
          prev[0]={
           $:1,
           $0:[x,y2]
          };
          _=y2;
         }
        return _;
       };
       return Snap1.Map(fn1,sn);
      },
      MarkDone:function(res,sn,v)
      {
       return Snap1.IsForever(sn)?Snap1.MarkForever(res,v):Snap1.MarkReady(res,v);
      },
      MarkForever:function(sn,v)
      {
       var matchValue,_,q;
       matchValue=sn.State;
       if(matchValue.$==3)
        {
         q=matchValue.$0;
         sn.State={
          $:0,
          $0:v
         };
         _=Seq.iter(function(k)
         {
          return k(v);
         },q);
        }
       else
        {
         _=null;
        }
       return _;
      },
      MarkObsolete:function(sn)
      {
       var matchValue,_,ks,ks1;
       matchValue=sn.State;
       if(matchValue.$==1)
        {
         _=null;
        }
       else
        {
         if(matchValue.$==2)
          {
           ks=matchValue.$1;
           sn.State={
            $:1
           };
           _=Seq.iter(function(k)
           {
            return k(null);
           },ks);
          }
         else
          {
           if(matchValue.$==3)
            {
             ks1=matchValue.$1;
             sn.State={
              $:1
             };
             _=Seq.iter(function(k)
             {
              return k(null);
             },ks1);
            }
           else
            {
             _=null;
            }
          }
        }
       return _;
      },
      MarkReady:function(sn,v)
      {
       var matchValue,_,q2,q1;
       matchValue=sn.State;
       if(matchValue.$==3)
        {
         q2=matchValue.$1;
         q1=matchValue.$0;
         sn.State={
          $:2,
          $0:v,
          $1:q2
         };
         _=Seq.iter(function(k)
         {
          return k(v);
         },q1);
        }
       else
        {
         _=null;
        }
       return _;
      },
      Sequence:function(snaps)
      {
       var _,res,snaps1,c,d,vs,obs,cont,action;
       if(Seq.isEmpty(snaps))
        {
         _=Snap1.CreateForever(Seq.empty());
        }
       else
        {
         res=Snap1.Create();
         snaps1=Arrays.ofSeq(snaps);
         c=Arrays.length(snaps1);
         d=[0];
         vs=[[]];
         obs=function()
         {
          d[0]=0;
          vs[0]=[];
          return Snap1.MarkObsolete(res);
         };
         cont=function()
         {
          return d[0]===c?Seq.forall(function(x)
          {
           return Snap1.IsForever(x);
          },snaps1)?Snap1.MarkForever(res,vs[0]):Snap1.MarkReady(res,vs[0]):null;
         };
         action=function(i)
         {
          return function(s)
          {
           return Snap1.When(s,function(x)
           {
            vs[0][i]=x;
            Ref.incr(d);
            return cont(null);
           },obs);
          };
         };
         Arrays.iteri(action,snaps1);
         _=res;
        }
       return _;
      },
      SnapshotOn:function(sn1,sn2)
      {
       var res,v,triggered,obs,cont;
       res=Snap1.Create();
       v=[{
        $:0
       }];
       triggered=[false];
       obs=function()
       {
        v[0]={
         $:0
        };
        return Snap1.MarkObsolete(res);
       };
       cont=function()
       {
        var _,matchValue,_1,_2,y,_3,y1,_4,y2;
        if(triggered[0])
         {
          matchValue=v[0];
          if(matchValue.$==1)
           {
            matchValue.$0;
            if(Snap1.IsForever(sn1))
             {
              y=matchValue.$0;
              _2=Snap1.MarkForever(res,y);
             }
            else
             {
              if(matchValue.$==1)
               {
                y1=matchValue.$0;
                _3=Snap1.MarkReady(res,y1);
               }
              else
               {
                _3=null;
               }
              _2=_3;
             }
            _1=_2;
           }
          else
           {
            if(matchValue.$==1)
             {
              y2=matchValue.$0;
              _4=Snap1.MarkReady(res,y2);
             }
            else
             {
              _4=null;
             }
            _1=_4;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       Snap1.When(sn1,function()
       {
        triggered[0]=true;
        return cont(null);
       },obs);
       Snap1.When(sn2,function(y)
       {
        v[0]={
         $:1,
         $0:y
        };
        return cont(null);
       },function()
       {
       });
       return res;
      },
      When:function(snap,avail,obsolete)
      {
       var matchValue,_,v,q,q2,q1,v1;
       matchValue=snap.State;
       if(matchValue.$==1)
        {
         _=obsolete(null);
        }
       else
        {
         if(matchValue.$==2)
          {
           v=matchValue.$0;
           q=matchValue.$1;
           q.push(obsolete);
           _=avail(v);
          }
         else
          {
           if(matchValue.$==3)
            {
             q2=matchValue.$1;
             q1=matchValue.$0;
             q1.push(avail);
             _=q2.push(obsolete);
            }
           else
            {
             v1=matchValue.$0;
             _=avail(v1);
            }
          }
        }
       return _;
      }
     },
     Storage1:{
      ArrayStorage:Runtime.Class({
       Add:function(i,arr)
       {
        var value;
        value=arr.push(i);
        return arr;
       },
       Init:function()
       {
        return this.init;
       },
       RemoveIf:function(pred,arr)
       {
        return Arrays.filter(pred,arr);
       },
       Set:function(coll)
       {
        return Seq.toArray(coll);
       },
       SetAt:function(idx,elem,arr)
       {
        Arrays.set(arr,idx,elem);
        return arr;
       }
      },{
       New:function(init)
       {
        var r;
        r=Runtime.New(this,{});
        r.init=init;
        return r;
       }
      }),
      InMemory:function(init)
      {
       return ArrayStorage.New(init);
      },
      LocalStorage:function(id,serializer)
      {
       return LocalStorageBackend.New(id,serializer);
      },
      LocalStorageBackend:Runtime.Class({
       Add:function(i,arr)
       {
        var value;
        value=arr.push(i);
        return this.set(arr);
       },
       Init:function()
       {
        var item,_,_1,x,mapping,matchValue;
        item=this.storage.getItem(this.id);
        if(item===null)
         {
          _=[];
         }
        else
         {
          try
          {
           x=JSON.parse(item);
           mapping=this.serializer.Decode;
           _1=Arrays.map(mapping,x);
          }
          catch(matchValue)
          {
           _1=[];
          }
          _=_1;
         }
        return _;
       },
       RemoveIf:function(pred,arr)
       {
        var arr1;
        arr1=Arrays.filter(pred,arr);
        return this.set(arr1);
       },
       Set:function(coll)
       {
        var arr;
        arr=Seq.toArray(coll);
        return this.set(arr);
       },
       SetAt:function(idx,elem,arr)
       {
        Arrays.set(arr,idx,elem);
        return this.set(arr);
       },
       clear:function()
       {
        return this.storage.removeItem(this.id);
       },
       set:function(arr)
       {
        var mapping,_arg00_;
        mapping=this.serializer.Encode;
        _arg00_=Arrays.map(mapping,arr);
        this.storage.setItem(this.id,JSON.stringify(_arg00_));
        return arr;
       }
      },{
       New:function(id,serializer)
       {
        var r;
        r=Runtime.New(this,{});
        r.id=id;
        r.serializer=serializer;
        r.storage=window.localStorage;
        return r;
       }
      })
     },
     String:{
      isBlank:function(s)
      {
       return Strings.forall(function(arg00)
       {
        return Char.IsWhiteSpace(arg00);
       },s);
      }
     },
     Submitter:Runtime.Class({
      Trigger:function()
      {
       return Var1.Set(this["var"],null);
      },
      get_Input:function()
      {
       return this.input;
      },
      get_View:function()
      {
       return this.view;
      }
     },{
      Create:function(input,init)
      {
       return Submitter.New(input,init);
      },
      New:function(input,init)
      {
       var r,arg10,arg20;
       r=Runtime.New(this,{});
       r.input=input;
       r["var"]=Var.Create(null);
       arg10=r["var"].get_View();
       arg20=r.input;
       r.view=View.SnapshotOn(init,arg10,arg20);
       return r;
      }
     }),
     Submitter1:Runtime.Class({},{
      CreateOption:function(input)
      {
       var arg00;
       arg00=function(arg0)
       {
        return{
         $:1,
         $0:arg0
        };
       };
       return Submitter.New(View.Map(arg00,input),{
        $:0
       });
      },
      Input:function(s)
      {
       return s.get_Input();
      },
      Trigger:function(s)
      {
       return s.Trigger();
      },
      View:function(s)
      {
       return s.get_View();
      }
     }),
     Trans:Runtime.Class({},{
      AnimateChange:function(tr,x,y)
      {
       return(tr.TChange.call(null,x))(y);
      },
      AnimateEnter:function(tr,x)
      {
       return tr.TEnter.call(null,x);
      },
      AnimateExit:function(tr,x)
      {
       return tr.TExit.call(null,x);
      }
     }),
     Trans1:Runtime.Class({},{
      CanAnimateChange:function(tr)
      {
       return(tr.TFlags&1)!==0;
      },
      CanAnimateEnter:function(tr)
      {
       return(tr.TFlags&2)!==0;
      },
      CanAnimateExit:function(tr)
      {
       return(tr.TFlags&4)!==0;
      },
      Change:function(ch,tr)
      {
       var TFlags;
       TFlags=tr.TFlags|1;
       return{
        TChange:ch,
        TEnter:tr.TEnter,
        TExit:tr.TExit,
        TFlags:TFlags
       };
      },
      Create:function(ch)
      {
       return{
        TChange:ch,
        TEnter:function(t)
        {
         return An.Const(t);
        },
        TExit:function(t)
        {
         return An.Const(t);
        },
        TFlags:1
       };
      },
      Enter:function(f,tr)
      {
       var TFlags;
       TFlags=tr.TFlags|2;
       return{
        TChange:tr.TChange,
        TEnter:f,
        TExit:tr.TExit,
        TFlags:TFlags
       };
      },
      Exit:function(f,tr)
      {
       var TFlags;
       TFlags=tr.TFlags|4;
       return{
        TChange:tr.TChange,
        TEnter:tr.TEnter,
        TExit:f,
        TFlags:TFlags
       };
      },
      Trivial:function()
      {
       return{
        TChange:function()
        {
         return function(y)
         {
          return An.Const(y);
         };
        },
        TEnter:function(t)
        {
         return An.Const(t);
        },
        TExit:function(t)
        {
         return An.Const(t);
        },
        TFlags:0
       };
      }
     }),
     Trie1:{
      AllSome:function(xs)
      {
       var e,r,ok,matchValue,_,x;
       e=Enumerator.Get(xs);
       r=ResizeArrayProxy.New2();
       ok=true;
       while(ok?e.MoveNext():false)
        {
         matchValue=e.get_Current();
         if(matchValue.$==1)
          {
           x=matchValue.$0;
           _=r.Add(x);
          }
         else
          {
           _=ok=false;
          }
        }
       return ok?{
        $:1,
        $0:r.ToArray()
       }:{
        $:0
       };
      },
      Empty:function()
      {
       return{
        $:1
       };
      },
      IsLeaf:function(t)
      {
       return t.$==2?true:false;
      },
      Leaf:function(v)
      {
       return{
        $:2,
        $0:v
       };
      },
      Look:function(key,trie)
      {
       var matchValue,_,v,_1,k,ks,map,matchValue1,_2,trie1;
       matchValue=[trie,key];
       if(matchValue[0].$==2)
        {
         v=matchValue[0].$0;
         _={
          $:0,
          $0:v,
          $1:key
         };
        }
       else
        {
         if(matchValue[0].$==0)
          {
           if(matchValue[1].$==1)
            {
             k=matchValue[1].$0;
             ks=matchValue[1].$1;
             map=matchValue[0].$0;
             matchValue1=MapModule.TryFind(k,map);
             if(matchValue1.$==0)
              {
               _2={
                $:1
               };
              }
             else
              {
               trie1=matchValue1.$0;
               _2=Trie1.Look(ks,trie1);
              }
             _1=_2;
            }
           else
            {
             _1={
              $:1
             };
            }
           _=_1;
          }
         else
          {
           _={
            $:1
           };
          }
        }
       return _;
      },
      Lookup:function(trie,key)
      {
       return Trie1.Look(Seq.toList(key),trie);
      },
      Map:function(f,trie)
      {
       return Trie1.MapLoop(Runtime.New(T,{
        $:0
       }),f,trie);
      },
      MapLoop:function(loc,f,trie)
      {
       var _,x,mp,mapping,xs;
       if(trie.$==1)
        {
         _={
          $:1
         };
        }
       else
        {
         if(trie.$==2)
          {
           x=trie.$0;
           _={
            $:2,
            $0:(f(loc))(x)
           };
          }
         else
          {
           mp=trie.$0;
           mapping=function(k)
           {
            return function(v)
            {
             return Trie1.MapLoop(List.append(loc,List.ofArray([k])),f,v);
            };
           };
           xs=MapModule.Map(mapping,mp);
           _=Trie1.TrieBranch(xs);
          }
        }
       return _;
      },
      Mapi:function(f,trie)
      {
       var counter,next;
       counter=[0];
       next=function()
       {
        var c;
        c=counter[0];
        counter[0]=c+1;
        return c;
       };
       return Trie1.Map(function(x)
       {
        return(f(next(null)))(x);
       },trie);
      },
      Merge:function(ts)
      {
       var ts1,matchValue,_,_1,chooser,merge,mapping,maps,option;
       ts1=Seq.toArray(ts);
       matchValue=Arrays.length(ts1);
       if(matchValue===0)
        {
         _={
          $:1,
          $0:{
           $:1
          }
         };
        }
       else
        {
         if(matchValue===1)
          {
           _={
            $:1,
            $0:Arrays.get(ts1,0)
           };
          }
         else
          {
           if(Seq.exists(function(t)
           {
            return Trie1.IsLeaf(t);
           },ts1))
            {
             _1={
              $:0
             };
            }
           else
            {
             chooser=function(_arg1)
             {
              var _2,map;
              if(_arg1.$==0)
               {
                map=_arg1.$0;
                _2={
                 $:1,
                 $0:map
                };
               }
              else
               {
                _2={
                 $:0
                };
               }
              return _2;
             };
             merge=function(_arg00_)
             {
              return Trie1.Merge(_arg00_);
             };
             mapping=function(xs)
             {
              return Trie1.TrieBranch(xs);
             };
             maps=Seq.choose(chooser,ts1);
             option=Trie1.MergeMaps(merge,maps);
             _1=Option.map(mapping,option);
            }
           _=_1;
          }
        }
       return _;
      },
      MergeMaps:function(merge,maps)
      {
       var x,folder,state,x1,x2,mapping,x3,x4,mapping2;
       x=Seq.collect(function(table)
       {
        return MapModule.ToSeq(table);
       },maps);
       folder=function(s)
       {
        return function(tupledArg)
        {
         var k,v;
         k=tupledArg[0];
         v=tupledArg[1];
         return Trie1.MultiAdd(k,v,s);
        };
       };
       state=FSharpMap.New1([]);
       x1=Seq.fold(folder,state,x);
       x2=MapModule.ToSeq(x1);
       mapping=function(tupledArg)
       {
        var k,vs,mapping1,option;
        k=tupledArg[0];
        vs=tupledArg[1];
        mapping1=function(v)
        {
         return[k,v];
        };
        option=merge(vs);
        return Option.map(mapping1,option);
       };
       x3=Seq.map(mapping,x2);
       x4=Trie1.AllSome(x3);
       mapping2=function(elements)
       {
        return MapModule.OfArray(Seq.toArray(elements));
       };
       return Option.map(mapping2,x4);
      },
      MultiAdd:function(key,value,map)
      {
       return map.Add(key,Runtime.New(T,{
        $:1,
        $0:value,
        $1:Trie1.MultiFind(key,map)
       }));
      },
      MultiFind:function(key,map)
      {
       return Operators.DefaultArg(MapModule.TryFind(key,map),Runtime.New(T,{
        $:0
       }));
      },
      Prefix:function(key,trie)
      {
       return Trie1.TrieBranch(FSharpMap.New1(List.ofArray([[key,trie]])));
      },
      ToArray:function(trie)
      {
       var all,value;
       all=[];
       value=Trie1.Map(function()
       {
        return function(v)
        {
         return all.push(v);
        };
       },trie);
       return all.slice(0);
      },
      TrieBranch:function(xs)
      {
       return xs.get_IsEmpty()?{
        $:1
       }:{
        $:0,
        $0:xs
       };
      }
     },
     Var:Runtime.Class({
      Get:function()
      {
       return Var.Get(this);
      },
      Set:function(v)
      {
       return Var1.Set(this,v);
      },
      Update:function(f)
      {
       return Var1.Update(this,f);
      },
      UpdateMaybe:function(f)
      {
       var matchValue,_,v;
       matchValue=f(Var.Get(this));
       if(matchValue.$==1)
        {
         v=matchValue.$0;
         _=Var1.Set(this,v);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Id:function()
      {
       return"uinref"+Global.String(Var1.GetId(this));
      },
      get_Value:function()
      {
       return Var.Get(this);
      },
      get_View:function()
      {
       var _this=this;
       return{
        $:0,
        $0:function()
        {
         return Var1.Observe(_this);
        }
       };
      },
      get_View1:function()
      {
       return this.get_View();
      },
      set_Value:function(v)
      {
       return Var1.Set(this,v);
      }
     },{
      Create:function(v)
      {
       return Runtime.New(Var,{
        Const:false,
        Current:v,
        Snap:Snap1.CreateWithValue(v),
        Id:Fresh.Int()
       });
      },
      Get:function(_var)
      {
       return _var.Current;
      }
     }),
     Var1:Runtime.Class({},{
      GetId:function(_var)
      {
       return _var.Id;
      },
      Lens:function(iref,get,update)
      {
       return RefImpl.New(iref,get,update);
      },
      Observe:function(_var)
      {
       return _var.Snap;
      },
      Set:function(_var,value)
      {
       var _;
       if(_var.Const)
        {
         _=null;
        }
       else
        {
         Snap1.MarkObsolete(_var.Snap);
         _var.Current=value;
         _=void(_var.Snap=Snap1.CreateWithValue(value));
        }
       return _;
      },
      SetFinal:function(_var,value)
      {
       var _;
       if(_var.Const)
        {
         _=null;
        }
       else
        {
         _var.Const=true;
         _var.Current=value;
         _=void(_var.Snap=Snap1.CreateForever(value));
        }
       return _;
      },
      Update:function(_var,fn)
      {
       var arg10;
       arg10=fn(Var.Get(_var));
       return Var1.Set(_var,arg10);
      }
     }),
     View:Runtime.Class({},{
      ConvertSeqNode:function(conv,value)
      {
       var _var,view;
       _var=Var.Create(value);
       view=_var.get_View();
       return{
        NValue:conv(view),
        NVar:_var,
        NView:view
       };
      },
      CreateLazy:function(observe)
      {
       var cur,obs;
       cur=[{
        $:0
       }];
       obs=function()
       {
        var matchValue,_,sn,_1,sn1,sn2,sn3;
        matchValue=cur[0];
        if(matchValue.$==1)
         {
          sn=matchValue.$0;
          if(!Snap1.IsObsolete(sn))
           {
            sn1=matchValue.$0;
            _1=sn1;
           }
          else
           {
            sn2=observe(null);
            cur[0]={
             $:1,
             $0:sn2
            };
            _1=sn2;
           }
          _=_1;
         }
        else
         {
          sn3=observe(null);
          cur[0]={
           $:1,
           $0:sn3
          };
          _=sn3;
         }
        return _;
       };
       return{
        $:0,
        $0:obs
       };
      },
      CreateLazy2:function(snapFn,_arg4,_arg3)
      {
       var o1,o2;
       o1=_arg4.$0;
       o2=_arg3.$0;
       return View.CreateLazy(function()
       {
        var s1,s2;
        s1=o1(null);
        s2=o2(null);
        return(snapFn(s1))(s2);
       });
      },
      Map:function(fn,_arg1)
      {
       var observe;
       observe=_arg1.$0;
       return View.CreateLazy(function()
       {
        var _arg10_;
        _arg10_=observe(null);
        return Snap1.Map(fn,_arg10_);
       });
      },
      Map2:function(fn,v1,v2)
      {
       var arg00;
       arg00=function(_arg10_)
       {
        return function(_arg20_)
        {
         return Snap1.Map2(fn,_arg10_,_arg20_);
        };
       };
       return View.CreateLazy2(arg00,v1,v2);
      },
      MapAsync:function(fn,_arg5)
      {
       var observe;
       observe=_arg5.$0;
       return View.CreateLazy(function()
       {
        var _arg10_;
        _arg10_=observe(null);
        return Snap1.MapAsync(fn,_arg10_);
       });
      },
      MapAsync2:function(fn,v1,v2)
      {
       var arg00,arg10;
       arg00=function(x)
       {
        return x;
       };
       arg10=View.Map2(fn,v1,v2);
       return View.MapAsync(arg00,arg10);
      },
      MapCached:function(fn,_arg2)
      {
       var observe,vref;
       observe=_arg2.$0;
       vref=[{
        $:0
       }];
       return View.CreateLazy(function()
       {
        var _arg20_;
        _arg20_=observe(null);
        return Snap1.MapCached(vref,fn,_arg20_);
       });
      },
      MapSeqCached:function(conv,view)
      {
       var arg00;
       arg00=function(x)
       {
        return x;
       };
       return View.MapSeqCachedBy(arg00,conv,view);
      },
      MapSeqCachedBy:function(key,conv,view)
      {
       var state,arg00;
       state=[Dictionary.New12()];
       arg00=function(xs)
       {
        var prevState,newState,mapping,array,result;
        prevState=state[0];
        newState=Dictionary.New12();
        mapping=function(x)
        {
         var k,res;
         k=key(x);
         res=prevState.ContainsKey(k)?prevState.get_Item(k):conv(x);
         newState.set_Item(k,res);
         return res;
        };
        array=Seq.toArray(xs);
        result=Arrays.map(mapping,array);
        state[0]=newState;
        return result;
       };
       return View.Map(arg00,view);
      },
      MapSeqCachedView:function(conv,view)
      {
       var arg00,arg10;
       arg00=function(x)
       {
        return x;
       };
       arg10=function()
       {
        return function(v)
        {
         return conv(v);
        };
       };
       return View.MapSeqCachedViewBy(arg00,arg10,view);
      },
      MapSeqCachedViewBy:function(key,conv,view)
      {
       var state,arg00;
       state=[Dictionary.New12()];
       arg00=function(xs)
       {
        var prevState,newState,x,mapping,result;
        prevState=state[0];
        newState=Dictionary.New12();
        x=Seq.toArray(xs);
        mapping=function(x1)
        {
         var k,node,_,n,arg001,arg002;
         k=key(x1);
         if(prevState.ContainsKey(k))
          {
           n=prevState.get_Item(k);
           arg001=n.NVar;
           Var1.Set(arg001,x1);
           _=n;
          }
         else
          {
           arg002=function(v)
           {
            return(conv(k))(v);
           };
           _=View.ConvertSeqNode(arg002,x1);
          }
         node=_;
         newState.set_Item(k,node);
         return node.NValue;
        };
        result=Arrays.map(mapping,x);
        state[0]=newState;
        return result;
       };
       return View.Map(arg00,view);
      },
      SnapshotOn:function(def,_arg7,_arg6)
      {
       var o1,o2,sInit,obs;
       o1=_arg7.$0;
       o2=_arg6.$0;
       sInit=Snap1.CreateWithValue(def);
       obs=function()
       {
        var s1,s2,_,s;
        s1=o1(null);
        s2=o2(null);
        if(Snap1.IsObsolete(sInit))
         {
          _=Snap1.SnapshotOn(s1,s2);
         }
        else
         {
          s=Snap1.SnapshotOn(s1,s2);
          Snap1.When(s,function()
          {
          },function()
          {
           return Snap1.MarkObsolete(sInit);
          });
          _=sInit;
         }
        return _;
       };
       return View.CreateLazy(obs);
      },
      UpdateWhile:function(def,v1,v2)
      {
       var value,arg00;
       value=[def];
       arg00=function(pred)
       {
        return function(v)
        {
         pred?void(value[0]=v):null;
         return value[0];
        };
       };
       return View.Map2(arg00,v1,v2);
      },
      get_Do:function()
      {
       return{
        $:0
       };
      }
     }),
     View1:Runtime.Class({},{
      Apply:function(fn,view)
      {
       var arg00;
       arg00=function(f)
       {
        return function(x)
        {
         return f(x);
        };
       };
       return View.Map2(arg00,fn,view);
      },
      Bind:function(fn,view)
      {
       return View1.Join(View.Map(fn,view));
      },
      Const:function(x)
      {
       var o;
       o=Snap1.CreateForever(x);
       return{
        $:0,
        $0:function()
        {
         return o;
        }
       };
      },
      ConstAsync:function(a)
      {
       var o;
       o=Snap1.CreateForeverAsync(a);
       return{
        $:0,
        $0:function()
        {
         return o;
        }
       };
      },
      Join:function(_arg8)
      {
       var observe;
       observe=_arg8.$0;
       return View.CreateLazy(function()
       {
        var _arg00_,_arg10_;
        _arg00_=function(_arg2)
        {
         var obs;
         obs=_arg2.$0;
         return obs(null);
        };
        _arg10_=observe(null);
        return Snap1.Bind(_arg00_,_arg10_);
       });
      },
      Sequence:function(views)
      {
       return View.CreateLazy(function()
       {
        var mapping,_arg00_;
        mapping=function(_arg3)
        {
         var observe;
         observe=_arg3.$0;
         return observe(null);
        };
        _arg00_=Seq.map(mapping,views);
        return Snap1.Sequence(_arg00_);
       });
      },
      Sink:function(act,_arg11)
      {
       var observe,loop;
       observe=_arg11.$0;
       loop=function()
       {
        var sn;
        sn=observe(null);
        return Snap1.When(sn,act,function()
        {
         return Async.Schedule(loop);
        });
       };
       return Async.Schedule(loop);
      },
      TryFinally:function(f,_arg10)
      {
       var observe;
       observe=_arg10.$0;
       return View.CreateLazy(function()
       {
        var _;
        try
        {
         _=observe(null);
        }
        finally
        {
         f(null);
        }
        return _;
       });
      },
      TryWith:function(f,_arg9)
      {
       var observe;
       observe=_arg9.$0;
       return View.CreateLazy(function()
       {
        var _,exn,patternInput,obs;
        try
        {
         _=observe(null);
        }
        catch(exn)
        {
         patternInput=f(exn);
         obs=patternInput.$0;
         _=obs(null);
        }
        return _;
       });
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Array=Runtime.Safe(Global.Array);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Abbrev=Runtime.Safe(Next.Abbrev);
  Fresh=Runtime.Safe(Abbrev.Fresh);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  HashSet=Runtime.Safe(Abbrev.HashSet);
  Slot1=Runtime.Safe(Abbrev.Slot1);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  An=Runtime.Safe(Next.An);
  AppendList1=Runtime.Safe(Next.AppendList1);
  Anims=Runtime.Safe(Next.Anims);
  requestAnimationFrame=Runtime.Safe(Global.requestAnimationFrame);
  Trans=Runtime.Safe(Next.Trans);
  Option=Runtime.Safe(Global.WebSharper.Option);
  View=Runtime.Safe(Next.View);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  Array1=Runtime.Safe(Next.Array);
  Attrs=Runtime.Safe(Next.Attrs);
  DomUtility=Runtime.Safe(Next.DomUtility);
  AttrModule=Runtime.Safe(Next.AttrModule);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  List=Runtime.Safe(Global.WebSharper.List);
  AnimatedAttrNode=Runtime.Safe(Next.AnimatedAttrNode);
  Trans1=Runtime.Safe(Next.Trans1);
  DynamicAttrNode=Runtime.Safe(Next.DynamicAttrNode);
  View1=Runtime.Safe(Next.View1);
  document=Runtime.Safe(Global.document);
  Doc=Runtime.Safe(Next.Doc);
  Elt=Runtime.Safe(Next.Elt);
  Seq1=Runtime.Safe(Global.Seq);
  Docs=Runtime.Safe(Next.Docs);
  String=Runtime.Safe(Next.String);
  CheckedInput=Runtime.Safe(Next.CheckedInput);
  Mailbox=Runtime.Safe(Abbrev.Mailbox);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  T=Runtime.Safe(List.T);
  jQuery=Runtime.Safe(Global.jQuery);
  NodeSet=Runtime.Safe(Docs.NodeSet);
  DocElemNode=Runtime.Safe(Next.DocElemNode);
  DomNodes=Runtime.Safe(Docs.DomNodes);
  Easing=Runtime.Safe(Next.Easing);
  Easings=Runtime.Safe(Next.Easings);
  Var=Runtime.Safe(Next.Var);
  Var1=Runtime.Safe(Next.Var1);
  RegExp=Runtime.Safe(Global.RegExp);
  FlowBuilder=Runtime.Safe(Next.FlowBuilder);
  Flow=Runtime.Safe(Next.Flow);
  Input=Runtime.Safe(Next.Input);
  DoubleInterpolation=Runtime.Safe(Next.DoubleInterpolation);
  Key=Runtime.Safe(Next.Key);
  ListModels=Runtime.Safe(Next.ListModels);
  RefImpl1=Runtime.Safe(Next.RefImpl1);
  ListModel1=Runtime.Safe(Next.ListModel1);
  Storage1=Runtime.Safe(Next.Storage1);
  ListModel=Runtime.Safe(Next.ListModel);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Model1=Runtime.Safe(Next.Model1);
  Model=Runtime.Safe(Next.Model);
  encodeURIComponent=Runtime.Safe(Global.encodeURIComponent);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  Route=Runtime.Safe(Next.Route);
  decodeURIComponent=Runtime.Safe(Global.decodeURIComponent);
  Routing=Runtime.Safe(Next.Routing);
  Router=Runtime.Safe(Next.Router);
  Trie1=Runtime.Safe(Next.Trie1);
  window=Runtime.Safe(Global.window);
  Snap1=Runtime.Safe(Next.Snap1);
  Async=Runtime.Safe(Abbrev.Async);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  ArrayStorage=Runtime.Safe(Storage1.ArrayStorage);
  LocalStorageBackend=Runtime.Safe(Storage1.LocalStorageBackend);
  JSON=Runtime.Safe(Global.JSON);
  Char=Runtime.Safe(Global.WebSharper.Char);
  Submitter=Runtime.Safe(Next.Submitter);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  MapModule=Runtime.Safe(Collections.MapModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  return RefImpl=Runtime.Safe(Next.RefImpl);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Elt,Doc);
  Input.MousePosSt1();
  Input.MouseBtnSt1();
  Input.KeyListenerState();
  Input.ActivateKeyListener();
  Input.ActivateButtonListener();
  Easings.CubicInOut();
  DomUtility.Doc();
  Attrs.EmptyAttr();
  Fresh.counter();
  return;
 });
}());

(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,UI,Next,Formlets,Controls,Doc,List,AttrModule,Formlet1,View,Layout,Var,T,Collections,Dictionary,Result,View1,Formlet,Builder,ListModel,Arrays,Seq,Array,Key,Enumerator,Submitter,AttrProxy,Option,RegExp,Validation;
 Runtime.Define(Global,{
  WebSharper:{
   UI:{
    Next:{
     Formlets:{
      Controls:{
       CheckBox:function(init)
       {
        return Controls["InputInit'"](init,function(_var)
        {
         return Controls.CheckBoxLayout(_var);
        });
       },
       CheckBoxLayout:function(_var)
       {
        return Doc.CheckBox(List.ofArray([AttrModule.Class("inputCheckbox")]),_var);
       },
       CheckBoxVar:function(_var)
       {
        return Controls["InputVar'"](_var,function(_var1)
        {
         return Controls.CheckBoxLayout(_var1);
        });
       },
       FloatInput:function(init)
       {
        return Controls["InputInit'"](init,function(_var)
        {
         return Controls.FloatInputLayout(_var);
        });
       },
       FloatInputLayout:function(_var)
       {
        return Doc.FloatInput(List.ofArray([AttrModule.Class("inputText")]),_var);
       },
       FloatInputUnchecked:function(init)
       {
        return Controls["InputInit'"](init,function(_var)
        {
         return Controls.FloatInputUncheckedLayout(_var);
        });
       },
       FloatInputUncheckedLayout:function(_var)
       {
        return Doc.FloatInputUnchecked(List.ofArray([AttrModule.Class("inputText")]),_var);
       },
       FloatInputVar:function(_var)
       {
        return Controls["InputVar'"](_var,function(_var1)
        {
         return Controls.FloatInputLayout(_var1);
        });
       },
       FloatInputVarUnchecked:function(_var)
       {
        return Controls["InputVar'"](_var,function(_var1)
        {
         return Controls.FloatInputUncheckedLayout(_var1);
        });
       },
       Input:function(init)
       {
        return Controls["InputInit'"](init,function(_var)
        {
         return Controls.InputLayout(_var);
        });
       },
       "Input'":function(_var,layout)
       {
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var _var1,arg00,arg10;
          _var1=_var(null);
          arg00=function(arg0)
          {
           return{
            $:0,
            $0:arg0
           };
          };
          arg10=_var1.get_View();
          return{
           View:View.Map(arg00,arg10),
           Layout:List.ofArray([Layout.Item(layout(_var1))])
          };
         }
        });
       },
       "InputInit'":function(init,layout)
       {
        return Controls["Input'"](function()
        {
         return Var.Create(init);
        },layout);
       },
       InputLayout:function(_var)
       {
        return Doc.Input(List.ofArray([AttrModule.Class("inputText")]),_var);
       },
       InputVar:function(_var)
       {
        return Controls["InputVar'"](_var,function(_var1)
        {
         return Controls.InputLayout(_var1);
        });
       },
       "InputVar'":function(_var,layout)
       {
        return Controls["Input'"](function()
        {
         return _var;
        },layout);
       },
       IntInput:function(init)
       {
        return Controls["InputInit'"](init,function(_var)
        {
         return Controls.IntInputLayout(_var);
        });
       },
       IntInputLayout:function(_var)
       {
        return Doc.IntInput(List.ofArray([AttrModule.Class("inputText")]),_var);
       },
       IntInputUnchecked:function(init)
       {
        return Controls["InputInit'"](init,function(_var)
        {
         return Controls.IntInputUncheckedLayout(_var);
        });
       },
       IntInputUncheckedLayout:function(_var)
       {
        return Doc.IntInputUnchecked(List.ofArray([AttrModule.Class("inputText")]),_var);
       },
       IntInputVar:function(_var)
       {
        return Controls["InputVar'"](_var,function(_var1)
        {
         return Controls.IntInputLayout(_var1);
        });
       },
       IntInputVarUnchecked:function(_var)
       {
        return Controls["InputVar'"](_var,function(_var1)
        {
         return Controls.IntInputUncheckedLayout(_var1);
        });
       },
       Radio:function(init,items)
       {
        return Controls["Radio'"](function()
        {
         return Var.Create(init);
        },items);
       },
       "Radio'":function(_var,items)
       {
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var _var1,arg00,arg10,x,mapping;
          _var1=_var(null);
          arg00=function(arg0)
          {
           return{
            $:0,
            $0:arg0
           };
          };
          arg10=_var1.get_View();
          x=List.rev(items);
          mapping=function(tupledArg)
          {
           var value,label,arg101,arg20;
           value=tupledArg[0];
           label=tupledArg[1];
           arg101=Runtime.New(T,{
            $:0
           });
           arg20=List.ofArray([Doc.Radio(List.ofArray([AttrModule.Class("inputRadio")]),value,_var1),Doc.TextNode(label)]);
           return Layout.Item(Doc.Element("label",arg101,arg20));
          };
          return{
           View:View.Map(arg00,arg10),
           Layout:List.map(mapping,x)
          };
         }
        });
       },
       RadioVar:function(_var,items)
       {
        return Controls["Radio'"](function()
        {
         return _var;
        },items);
       },
       Select:function(init,items)
       {
        return Controls["Select'"](function(layout)
        {
         return Controls["InputInit'"](init,layout);
        },items);
       },
       "Select'":function(mk,items)
       {
        var labels,mapping,values,_arg00_,optionText;
        labels=Dictionary.New12();
        mapping=function(tupledArg)
        {
         var value,label;
         value=tupledArg[0];
         label=tupledArg[1];
         labels.set_Item(value,label);
         return value;
        };
        values=List.map(mapping,items);
        _arg00_=Runtime.New(T,{
         $:0
        });
        optionText=function(v)
        {
         return labels.get_Item(v);
        };
        return mk(function(_arg30_)
        {
         return Doc.Select(_arg00_,optionText,values,_arg30_);
        });
       },
       SelectVar:function(_var,items)
       {
        return Controls["Select'"](function(layout)
        {
         return Controls["InputVar'"](_var,layout);
        },items);
       }
      },
      Formlet:{
       Bind:function(_arg1,f)
       {
        var flX;
        flX=_arg1.$0;
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var flX1,f1,arg10,v;
          flX1=flX(null);
          f1=function(x)
          {
           return(f(x).get_Data())(null);
          };
          arg10=flX1.View;
          v=View.Map(function(rX)
          {
           return Result.Map(f1,rX);
          },arg10);
          return{
           View:View1.Bind(function(_arg2)
           {
            var _,m,x;
            if(_arg2.$==1)
             {
              m=_arg2.$0;
              _=View1.Const({
               $:1,
               $0:m
              });
             }
            else
             {
              x=_arg2.$0;
              _=x.View;
             }
            return _;
           },v),
           Layout:Runtime.New(T,{
            $:1,
            $0:Layout.Varying(View.Map(function(_arg3)
            {
             var _,flY;
             if(_arg3.$==0)
              {
               flY=_arg3.$0;
               _=flY.Layout;
              }
             else
              {
               _=Runtime.New(T,{
                $:0
               });
              }
             return _;
            },v)),
            $1:flX1.Layout
           })
          };
         }
        });
       },
       Builder:Runtime.Class({
        Bind:function(flX,f)
        {
         return Formlet.Bind(flX,f);
        },
        Return:function(x)
        {
         return Formlet.Return(x);
        },
        ReturnFrom:function(flX)
        {
         return flX;
        }
       },{
        New:function()
        {
         return Runtime.New(this,{});
        }
       }),
       Do:Runtime.Field(function()
       {
        return Builder.New();
       }),
       Horizontal:function(_arg1)
       {
        var flX;
        flX=_arg1.$0;
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var flX1,toHorizontal,Layout1;
          flX1=flX(null);
          toHorizontal=function(_arg2)
          {
           var _,_1,l,matchValue,_2,ls,v;
           if(_arg2.$==1)
            {
             if(_arg2.$1.$==0)
              {
               l=_arg2.$0;
               matchValue=l.Shape;
               if(matchValue.$==3)
                {
                 ls=matchValue.$0;
                 _2=Runtime.New(Layout,{
                  Shape:{
                   $:2,
                   $0:ls
                  },
                  Label:l.Label
                 });
                }
               else
                {
                 if(matchValue.$==1)
                  {
                   v=matchValue.$0;
                   _2=Runtime.New(Layout,{
                    Shape:{
                     $:1,
                     $0:View.Map(toHorizontal,v)
                    },
                    Label:l.Label
                   });
                  }
                 else
                  {
                   _2=l;
                  }
                }
               _1=List.ofArray([_2]);
              }
             else
              {
               _1=List.ofArray([Runtime.New(Layout,{
                Shape:{
                 $:2,
                 $0:_arg2
                },
                Label:{
                 $:0
                }
               })]);
              }
             _=_1;
            }
           else
            {
             _=Runtime.New(T,{
              $:0
             });
            }
           return _;
          };
          Layout1=toHorizontal(flX1.Layout);
          return{
           View:flX1.View,
           Layout:Layout1
          };
         }
        });
       },
       LiftResult:function(flX)
       {
        return Formlet.MapResult(function(arg0)
        {
         return{
          $:0,
          $0:arg0
         };
        },flX);
       },
       Many:function(_arg1)
       {
        var f;
        f=_arg1.$0;
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var arg00,arg10,m,x,arg001,arg101,arg002,arg102,v,f1,z,arg003,re,arg104,arg201,f3,z1,re1;
          arg00=function(tuple)
          {
           return tuple[0];
          };
          arg10=Runtime.New(T,{
           $:0
          });
          m=ListModel.Create(arg00,arg10);
          x=m.get_View();
          arg001=m.get_Key();
          arg101=function(tuple)
          {
           return tuple[1];
          };
          arg002=function(source)
          {
           return Arrays.ofSeq(source);
          };
          arg102=View.MapSeqCachedBy(arg001,arg101,x);
          v=View.Map(arg002,arg102);
          f1=function(fl)
          {
           var f2;
           f2=function(value)
           {
            return[value];
           };
           return View.Map(function(rX)
           {
            return Result.Map(f2,rX);
           },fl.View);
          };
          z=View1.Const({
           $:0,
           $0:Seq.empty()
          });
          arg003=function(r1)
          {
           return function(r2)
           {
            return Result.Append(r1,r2);
           };
          };
          re=function(arg103)
          {
           return function(arg20)
           {
            return View.Map2(arg003,arg103,arg20);
           };
          };
          arg104=List.ofArray([AttrModule.Class("addIcon"),AttrModule.Handler("click",function()
          {
           return function()
           {
            return m.Add([Key.Fresh(),f(null)]);
           };
          })]);
          arg201=Runtime.New(T,{
           $:0
          });
          f3=function(fl)
          {
           return fl.Layout;
          };
          z1=Runtime.New(T,{
           $:0
          });
          re1=function(x1)
          {
           return function(y)
           {
            return List.append(y,x1);
           };
          };
          return{
           View:View1.Bind(function(a)
           {
            return Array.MapReduce(f1,z,re,a);
           },v),
           Layout:List.ofArray([Layout.Item(Doc.Element("div",arg104,arg201)),Layout.Varying(View.Map(function(a)
           {
            return Array.MapReduce(f3,z1,re1,a);
           },v))])
          };
         }
        });
       },
       ManyWithModel:function(m,insertInit,f)
       {
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var arg00,arg10,mf,v,cb,mapping,v1,f1,z,arg001,re,arg102,arg201,x1,arg002,f3,z1,re1;
          arg00=function(tuple)
          {
           return tuple[0];
          };
          arg10=Runtime.New(T,{
           $:0
          });
          mf=ListModel.Create(arg00,arg10);
          m.Iter(function(x)
          {
           var k;
           k=(m.get_Key())(x);
           return mf.Add([k,(f(m.Lens(k)).get_Data())(null)]);
          });
          v=m.get_View();
          cb=View.Map(function(xs)
          {
           var enumerator,_,x,k,inputSequence,enumerator1,_1,forLoopVar,k1;
           enumerator=Enumerator.Get(xs);
           try
           {
            while(enumerator.MoveNext())
             {
              x=enumerator.get_Current();
              k=(m.get_Key())(x);
              !mf.ContainsKey(k)?mf.Add([k,(f(m.Lens(k)).get_Data())(null)]):null;
             }
           }
           finally
           {
            enumerator.Dispose!=undefined?enumerator.Dispose():null;
           }
           inputSequence=mf.Var.get_Value();
           enumerator1=Enumerator.Get(inputSequence);
           try
           {
            while(enumerator1.MoveNext())
             {
              forLoopVar=enumerator1.get_Current();
              k1=forLoopVar[0];
              !m.ContainsKey(k1)?mf.RemoveByKey(k1):null;
             }
           }
           finally
           {
            enumerator1.Dispose!=undefined?enumerator1.Dispose():null;
           }
           return Doc.get_Empty();
          },v);
          mapping=function(tuple)
          {
           return tuple[1];
          };
          v1=View.Map(function(x)
          {
           var source;
           source=Seq.map(mapping,x);
           return Arrays.ofSeq(source);
          },mf.get_View());
          f1=function(fl)
          {
           var f2;
           f2=function(value)
           {
            return[value];
           };
           return View.Map(function(rX)
           {
            return Result.Map(f2,rX);
           },fl.View);
          };
          z=View1.Const({
           $:0,
           $0:Seq.empty()
          });
          arg001=function(r1)
          {
           return function(r2)
           {
            return Result.Append(r1,r2);
           };
          };
          re=function(arg101)
          {
           return function(arg20)
           {
            return View.Map2(arg001,arg101,arg20);
           };
          };
          arg102=List.ofArray([AttrModule.Class("addIcon"),AttrModule.Handler("click",function()
          {
           return function()
           {
            return m.Add(insertInit(null));
           };
          })]);
          arg201=Runtime.New(T,{
           $:0
          });
          x1=Doc.Element("div",arg102,arg201);
          arg002=Doc.EmbedView(cb);
          f3=function(fl)
          {
           return fl.Layout;
          };
          z1=Runtime.New(T,{
           $:0
          });
          re1=function(x)
          {
           return function(y)
           {
            return List.append(y,x);
           };
          };
          return{
           View:View1.Bind(function(a)
           {
            return Array.MapReduce(f1,z,re,a);
           },v1),
           Layout:List.ofArray([Layout.Item(Doc.Append(arg002,x1)),Layout.Varying(View.Map(function(a)
           {
            return Array.MapReduce(f3,z1,re1,a);
           },v1))])
          };
         }
        });
       },
       Map:function(f,flX)
       {
        return Formlet.MapResult(function(rX)
        {
         return Result.Map(f,rX);
        },flX);
       },
       MapLayout:function(f,_arg1)
       {
        var flX;
        flX=_arg1.$0;
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var flX1,Layout1;
          flX1=flX(null);
          Layout1=f(flX1.Layout);
          return{
           View:flX1.View,
           Layout:Layout1
          };
         }
        });
       },
       MapResult:function(f,_arg1)
       {
        var flX;
        flX=_arg1.$0;
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var flX1;
          flX1=flX(null);
          return{
           View:View.Map(f,flX1.View),
           Layout:flX1.Layout
          };
         }
        });
       },
       MapToResult:function(f,flX)
       {
        return Formlet.MapResult(function(rX)
        {
         return Result.Bind(f,rX);
        },flX);
       },
       OfDoc:function(f)
       {
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          return{
           View:View1.Const({
            $:0,
            $0:null
           }),
           Layout:List.ofArray([Layout.Item(f(null))])
          };
         }
        });
       },
       Return:function(x)
       {
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          return{
           View:View1.Const({
            $:0,
            $0:x
           }),
           Layout:Runtime.New(T,{
            $:0
           })
          };
         }
        });
       },
       Run:function(f,flX)
       {
        return Formlet.RunWithLayout(function(arg00)
        {
         return Layout.Flat(arg00);
        },f,flX);
       },
       RunWithLayout:function(render,f,_arg1)
       {
        var flX,flX1,_arg00_,_arg10_,x1,arg00;
        flX=_arg1.$0;
        flX1=flX(null);
        _arg00_=function(r)
        {
         var _,x;
         if(r.$==1)
          {
           _=null;
          }
         else
          {
           x=r.$0;
           _=f(x);
          }
         return Doc.get_Empty();
        };
        _arg10_=flX1.View;
        x1=Doc.BindView(_arg00_,_arg10_);
        arg00=render(Layout.OfList(flX1.Layout));
        return Doc.Append(arg00,x1);
       },
       Vertical:function(_arg1)
       {
        var flX;
        flX=_arg1.$0;
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var flX1,toVertical,Layout1;
          flX1=flX(null);
          toVertical=function(_arg2)
          {
           var _,_1,l,matchValue,_2,ls,v;
           if(_arg2.$==1)
            {
             if(_arg2.$1.$==0)
              {
               l=_arg2.$0;
               matchValue=l.Shape;
               if(matchValue.$==2)
                {
                 ls=matchValue.$0;
                 _2=Runtime.New(Layout,{
                  Shape:{
                   $:3,
                   $0:ls
                  },
                  Label:l.Label
                 });
                }
               else
                {
                 if(matchValue.$==1)
                  {
                   v=matchValue.$0;
                   _2=Runtime.New(Layout,{
                    Shape:{
                     $:1,
                     $0:View.Map(toVertical,v)
                    },
                    Label:l.Label
                   });
                  }
                 else
                  {
                   _2=l;
                  }
                }
               _1=List.ofArray([_2]);
              }
             else
              {
               _1=List.ofArray([Runtime.New(Layout,{
                Shape:{
                 $:3,
                 $0:_arg2
                },
                Label:{
                 $:0
                }
               })]);
              }
             _=_1;
            }
           else
            {
             _=Runtime.New(T,{
              $:0
             });
            }
           return _;
          };
          Layout1=toVertical(flX1.Layout);
          return{
           View:flX1.View,
           Layout:Layout1
          };
         }
        });
       },
       WithFormContainer:function(flX)
       {
        var f;
        f=function(d)
        {
         var arg10,arg20;
         arg10=List.ofArray([AttrModule.Class("formlet")]);
         arg20=List.ofArray([d]);
         return Doc.Element("form",arg10,arg20);
        };
        return Formlet.WrapLayout(f,flX);
       },
       WithLabel:function(label,flX)
       {
        return Formlet.MapLayout(function(_arg1)
        {
         var _,_1,x,Label;
         if(_arg1.$==1)
          {
           if(_arg1.$1.$==0)
            {
             x=_arg1.$0;
             Label={
              $:1,
              $0:label
             };
             _1=List.ofArray([Runtime.New(Layout,{
              Shape:x.Shape,
              Label:Label
             })]);
            }
           else
            {
             _1=List.ofArray([Runtime.New(Layout,{
              Shape:{
               $:3,
               $0:_arg1
              },
              Label:{
               $:1,
               $0:label
              }
             })]);
            }
           _=_1;
          }
         else
          {
           _=List.ofArray([Runtime.New(Layout,{
            Shape:{
             $:3,
             $0:_arg1
            },
            Label:{
             $:1,
             $0:label
            }
           })]);
          }
         return _;
        },flX);
       },
       WithSubmit:function(txt,_arg1)
       {
        var flX;
        flX=_arg1.$0;
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var flX1,arg00,arg10,sub,arg101,arg20;
          flX1=flX(null);
          arg00=flX1.View;
          arg10={
           $:1,
           $0:Runtime.New(T,{
            $:0
           })
          };
          sub=Submitter.Create(arg00,arg10);
          arg101=List.ofArray([AttrProxy.Create("type","button"),AttrProxy.Create("value",txt),AttrModule.Class("submitButton"),AttrModule.Handler("click",function()
          {
           return function()
           {
            return sub.Trigger();
           };
          }),AttrModule.DynamicPred("disabled",View.Map(function(x)
          {
           return Result.IsFailure(x);
          },sub.get_Input()),View1.Const("disabled"))]);
          arg20=Runtime.New(T,{
           $:0
          });
          return{
           View:sub.get_View(),
           Layout:Runtime.New(T,{
            $:1,
            $0:Layout.Item(Doc.Element("input",arg101,arg20)),
            $1:flX1.Layout
           })
          };
         }
        });
       },
       WithTextLabel:function(label,flX)
       {
        var f;
        f=function(l)
        {
         var label1,arg10,arg20,_,_1,x;
         arg10=Runtime.New(T,{
          $:0
         });
         arg20=List.ofArray([Doc.TextNode(label)]);
         label1={
          $:1,
          $0:Doc.Element("label",arg10,arg20)
         };
         if(l.$==1)
          {
           if(l.$1.$==0)
            {
             x=l.$0;
             _1=List.ofArray([Runtime.New(Layout,{
              Shape:x.Shape,
              Label:label1
             })]);
            }
           else
            {
             _1=List.ofArray([Runtime.New(Layout,{
              Shape:{
               $:3,
               $0:l
              },
              Label:label1
             })]);
            }
           _=_1;
          }
         else
          {
           _=List.ofArray([Runtime.New(Layout,{
            Shape:{
             $:3,
             $0:l
            },
            Label:label1
           })]);
          }
         return _;
        };
        return Formlet.MapLayout(f,flX);
       },
       WrapLayout:function(f,flX)
       {
        var f1;
        f1=function(ls)
        {
         var arg10;
         arg10=Layout.OfList(ls);
         return List.ofArray([Layout.Wrap(f,arg10)]);
        };
        return Formlet.MapLayout(f1,flX);
       }
      },
      Formlet1:Runtime.Class({
       get_Data:function()
       {
        var d;
        d=this.$0;
        return d;
       }
      }),
      Layout:Runtime.Class({},{
       Flat:function(l)
       {
        var label,hel,vel,hl,vl,full;
        label=function(l1,x)
        {
         var matchValue,_,l2,arg10,arg20;
         matchValue=l1.Label;
         if(matchValue.$==1)
          {
           l2=matchValue.$0;
           arg10=Runtime.New(T,{
            $:0
           });
           arg20=List.ofArray([l2,x]);
           _=List.ofArray([Doc.Element("label",arg10,arg20)]);
          }
         else
          {
           _=List.ofArray([x]);
          }
         return _;
        };
        hel=function(l1,x)
        {
         var arg10,arg20;
         arg10=List.ofArray([AttrModule.Style("display","inline-block")]);
         arg20=label(l1,x);
         return Doc.Element("div",arg10,arg20);
        };
        vel=function(l1,x)
        {
         var arg10,arg20;
         arg10=Runtime.New(T,{
          $:0
         });
         arg20=label(l1,x);
         return Doc.Element("div",arg10,arg20);
        };
        hl=function(x)
        {
         var x1,mapping;
         x1=List.rev(x);
         mapping=function(l1)
         {
          var matchValue,_,ls,x2,v,_arg00_,l2,f,ls1;
          matchValue=l1.Shape;
          if(matchValue.$==3)
           {
            ls=matchValue.$0;
            _=List.ofArray([hel(l1,Doc.Concat(vl(ls)))]);
           }
          else
           {
            if(matchValue.$==0)
             {
              x2=matchValue.$0;
              _=List.ofArray([hel(l1,x2)]);
             }
            else
             {
              if(matchValue.$==1)
               {
                v=matchValue.$0;
                _arg00_=function(x3)
                {
                 var arg00;
                 arg00=hl(x3);
                 return Doc.Concat(arg00);
                };
                _=List.ofArray([Doc.BindView(_arg00_,v)]);
               }
              else
               {
                if(matchValue.$==4)
                 {
                  l2=matchValue.$0;
                  f=matchValue.$1;
                  _=List.ofArray([f(full(Runtime.New(Layout,{
                   Shape:l2,
                   Label:{
                    $:0
                   }
                  })))]);
                 }
                else
                 {
                  ls1=matchValue.$0;
                  _=hl(ls1);
                 }
               }
             }
           }
          return _;
         };
         return List.collect(mapping,x1);
        };
        vl=function(x)
        {
         var x1,mapping;
         x1=List.rev(x);
         mapping=function(l1)
         {
          var matchValue,_,ls,x2,v,_arg00_,l2,f,ls1;
          matchValue=l1.Shape;
          if(matchValue.$==3)
           {
            ls=matchValue.$0;
            _=vl(ls);
           }
          else
           {
            if(matchValue.$==0)
             {
              x2=matchValue.$0;
              _=List.ofArray([vel(l1,x2)]);
             }
            else
             {
              if(matchValue.$==1)
               {
                v=matchValue.$0;
                _arg00_=function(x3)
                {
                 var arg00;
                 arg00=vl(x3);
                 return Doc.Concat(arg00);
                };
                _=List.ofArray([Doc.BindView(_arg00_,v)]);
               }
              else
               {
                if(matchValue.$==4)
                 {
                  l2=matchValue.$0;
                  f=matchValue.$1;
                  _=List.ofArray([f(full(Runtime.New(Layout,{
                   Shape:l2,
                   Label:{
                    $:0
                   }
                  })))]);
                 }
                else
                 {
                  ls1=matchValue.$0;
                  _=List.ofArray([vel(l1,Doc.Concat(hl(ls1)))]);
                 }
               }
             }
           }
          return _;
         };
         return List.collect(mapping,x1);
        };
        full=function(l1)
        {
         return Doc.Concat(vl(List.ofArray([l1])));
        };
        return full(l);
       },
       Horizontal:function(xs)
       {
        return Runtime.New(Layout,{
         Shape:{
          $:2,
          $0:xs
         },
         Label:{
          $:0
         }
        });
       },
       Item:function(doc)
       {
        return Runtime.New(Layout,{
         Shape:{
          $:0,
          $0:doc
         },
         Label:{
          $:0
         }
        });
       },
       OfList:function(ls)
       {
        var _,_1,l;
        if(ls.$==1)
         {
          if(ls.$1.$==0)
           {
            l=ls.$0;
            _1=l;
           }
          else
           {
            _1=Layout.Vertical(ls);
           }
          _=_1;
         }
        else
         {
          _=Layout.Vertical(ls);
         }
        return _;
       },
       Table:function(l)
       {
        var vel,vwrap,hel,hwrap,hl,vl,full;
        vel=function(l1,x)
        {
         var arg10,arg20,arg101,arg201,arg102,arg202;
         arg10=Runtime.New(T,{
          $:0
         });
         arg101=Runtime.New(T,{
          $:0
         });
         arg201=Option.toList(l1.Label);
         arg102=Runtime.New(T,{
          $:0
         });
         arg202=List.ofArray([x]);
         arg20=List.ofArray([Doc.Element("td",arg101,arg201),Doc.Element("td",arg102,arg202)]);
         return Doc.Element("tr",arg10,arg20);
        };
        vwrap=function(vels)
        {
         var arg10,arg20,arg101;
         arg10=Runtime.New(T,{
          $:0
         });
         arg101=Runtime.New(T,{
          $:0
         });
         arg20=List.ofArray([Doc.Element("tbody",arg101,vels)]);
         return Doc.Element("table",arg10,arg20);
        };
        hel=function(l1,x)
        {
         var matchValue,arg00,_,l2,arg10,arg20,arg101,arg201,arg102;
         matchValue=l1.Label;
         if(matchValue.$==1)
          {
           l2=matchValue.$0;
           arg10=Runtime.New(T,{
            $:0
           });
           arg20=List.ofArray([l2]);
           _=Doc.Element("td",arg10,arg20);
          }
         else
          {
           _=Doc.get_Empty();
          }
         arg00=_;
         arg101=Runtime.New(T,{
          $:0
         });
         arg201=List.ofArray([x]);
         arg102=Doc.Element("td",arg101,arg201);
         return Doc.Append(arg00,arg102);
        };
        hwrap=function(hels)
        {
         var arg00,arg10;
         arg10=Runtime.New(T,{
          $:0
         });
         arg00=List.ofArray([Doc.Element("tr",arg10,hels)]);
         return vwrap(arg00);
        };
        hl=function(x)
        {
         var x1,mapping;
         x1=List.rev(x);
         mapping=function(l1)
         {
          var matchValue,_,ls,arg00,x2,v,_arg00_,l2,f,ls1;
          matchValue=l1.Shape;
          if(matchValue.$==3)
           {
            ls=matchValue.$0;
            arg00=vl(ls);
            _=List.ofArray([hel(l1,vwrap(arg00))]);
           }
          else
           {
            if(matchValue.$==0)
             {
              x2=matchValue.$0;
              _=List.ofArray([hel(l1,x2)]);
             }
            else
             {
              if(matchValue.$==1)
               {
                v=matchValue.$0;
                _arg00_=function(x3)
                {
                 var arg001;
                 arg001=hl(x3);
                 return Doc.Concat(arg001);
                };
                _=List.ofArray([Doc.BindView(_arg00_,v)]);
               }
              else
               {
                if(matchValue.$==4)
                 {
                  l2=matchValue.$0;
                  f=matchValue.$1;
                  _=List.ofArray([f(full(Runtime.New(Layout,{
                   Shape:l2,
                   Label:{
                    $:0
                   }
                  })))]);
                 }
                else
                 {
                  ls1=matchValue.$0;
                  _=hl(ls1);
                 }
               }
             }
           }
          return _;
         };
         return List.collect(mapping,x1);
        };
        vl=function(x)
        {
         var x1,mapping;
         x1=List.rev(x);
         mapping=function(l1)
         {
          var matchValue,_,ls,x2,v,_arg00_,l2,f,ls1,arg001;
          matchValue=l1.Shape;
          if(matchValue.$==3)
           {
            ls=matchValue.$0;
            _=vl(ls);
           }
          else
           {
            if(matchValue.$==0)
             {
              x2=matchValue.$0;
              _=List.ofArray([vel(l1,x2)]);
             }
            else
             {
              if(matchValue.$==1)
               {
                v=matchValue.$0;
                _arg00_=function(x3)
                {
                 var arg00;
                 arg00=vl(x3);
                 return Doc.Concat(arg00);
                };
                _=List.ofArray([Doc.BindView(_arg00_,v)]);
               }
              else
               {
                if(matchValue.$==4)
                 {
                  l2=matchValue.$0;
                  f=matchValue.$1;
                  _=List.ofArray([f(full(Runtime.New(Layout,{
                   Shape:l2,
                   Label:{
                    $:0
                   }
                  })))]);
                 }
                else
                 {
                  ls1=matchValue.$0;
                  arg001=hl(ls1);
                  _=List.ofArray([vel(l1,hwrap(arg001))]);
                 }
               }
             }
           }
          return _;
         };
         return List.collect(mapping,x1);
        };
        full=function(l1)
        {
         var matchValue,_,ls,arg00,arg001,arg002,l2,f,ls1,arg003;
         matchValue=l1.Shape;
         if(matchValue.$==3)
          {
           ls=matchValue.$0;
           arg00=vl(ls);
           _=vwrap(arg00);
          }
         else
          {
           if(matchValue.$==0)
            {
             arg001=vl(List.ofArray([l1]));
             _=vwrap(arg001);
            }
           else
            {
             if(matchValue.$==1)
              {
               arg002=vl(List.ofArray([l1]));
               _=vwrap(arg002);
              }
             else
              {
               if(matchValue.$==4)
                {
                 l2=matchValue.$0;
                 f=matchValue.$1;
                 _=f(full(Runtime.New(Layout,{
                  Shape:l2,
                  Label:{
                   $:0
                  }
                 })));
                }
               else
                {
                 ls1=matchValue.$0;
                 arg003=hl(ls1);
                 _=hwrap(arg003);
                }
              }
            }
          }
         return _;
        };
        return full(l);
       },
       Varying:function(view)
       {
        return Runtime.New(Layout,{
         Shape:{
          $:1,
          $0:view
         },
         Label:{
          $:0
         }
        });
       },
       Vertical:function(xs)
       {
        return Runtime.New(Layout,{
         Shape:{
          $:3,
          $0:xs
         },
         Label:{
          $:0
         }
        });
       },
       Wrap:function(f,l)
       {
        return Runtime.New(Layout,{
         Shape:{
          $:4,
          $0:l.Shape,
          $1:f
         },
         Label:l.Label
        });
       }
      }),
      Pervasives:{
       op_LessMultiplyGreater:function(_arg2,_arg1)
       {
        var flF,flX;
        flF=_arg2.$0;
        flX=_arg1.$0;
        return Runtime.New(Formlet1,{
         $:0,
         $0:function()
         {
          var flF1,flX1,arg00,arg10,arg20;
          flF1=flF(null);
          flX1=flX(null);
          arg00=function(rF)
          {
           return function(rX)
           {
            return Result.Apply(rF,rX);
           };
          };
          arg10=flF1.View;
          arg20=flX1.View;
          return{
           View:View.Map2(arg00,arg10,arg20),
           Layout:List.append(flX1.Layout,flF1.Layout)
          };
         }
        });
       }
      },
      Result:{
       Append:function(r1,r2)
       {
        var _,m1,_1,m2,s1,_2,s2;
        if(r1.$==1)
         {
          m1=r1.$0;
          if(r2.$==1)
           {
            m2=r2.$0;
            _1={
             $:1,
             $0:List.append(m1,m2)
            };
           }
          else
           {
            _1=r2;
           }
          _=_1;
         }
        else
         {
          s1=r1.$0;
          if(r2.$==1)
           {
            _2=r2;
           }
          else
           {
            s2=r2.$0;
            _2={
             $:0,
             $0:Seq.append(s1,s2)
            };
           }
          _=_2;
         }
        return _;
       },
       Apply:function(rF,rX)
       {
        var _,mF,_1,mX,f,_2,mX1,x;
        if(rF.$==1)
         {
          mF=rF.$0;
          if(rX.$==1)
           {
            mX=rX.$0;
            _1={
             $:1,
             $0:List.append(mF,mX)
            };
           }
          else
           {
            _1={
             $:1,
             $0:mF
            };
           }
          _=_1;
         }
        else
         {
          f=rF.$0;
          if(rX.$==1)
           {
            mX1=rX.$0;
            _2={
             $:1,
             $0:mX1
            };
           }
          else
           {
            x=rX.$0;
            _2={
             $:0,
             $0:f(x)
            };
           }
          _=_2;
         }
        return _;
       },
       Bind:function(f,rX)
       {
        var _,m,x;
        if(rX.$==1)
         {
          m=rX.$0;
          _={
           $:1,
           $0:m
          };
         }
        else
         {
          x=rX.$0;
          _=f(x);
         }
        return _;
       },
       IsFailure:function(x)
       {
        return x.$==1?true:false;
       },
       IsSuccess:function(x)
       {
        return x.$==1?false:true;
       },
       Map:function(f,rX)
       {
        var _,m,x;
        if(rX.$==1)
         {
          m=rX.$0;
          _={
           $:1,
           $0:m
          };
         }
        else
         {
          x=rX.$0;
          _={
           $:0,
           $0:f(x)
          };
         }
        return _;
       }
      },
      Validation:{
       Is:function(pred,msg,flX)
       {
        var f;
        f=function(x)
        {
         return pred(x)?{
          $:0,
          $0:x
         }:{
          $:1,
          $0:List.ofArray([msg])
         };
        };
        return Formlet.MapToResult(f,flX);
       },
       IsMatch:function(regex,msg,flX)
       {
        var re;
        re=new RegExp(regex);
        return Validation.Is(function(arg00)
        {
         return re.test(arg00);
        },msg,flX);
       },
       IsNotEmpty:function(msg,flX)
       {
        return Validation.Is(function(y)
        {
         return""!==y;
        },msg,flX);
       }
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Formlets=Runtime.Safe(Next.Formlets);
  Controls=Runtime.Safe(Formlets.Controls);
  Doc=Runtime.Safe(Next.Doc);
  List=Runtime.Safe(Global.WebSharper.List);
  AttrModule=Runtime.Safe(Next.AttrModule);
  Formlet1=Runtime.Safe(Formlets.Formlet1);
  View=Runtime.Safe(Next.View);
  Layout=Runtime.Safe(Formlets.Layout);
  Var=Runtime.Safe(Next.Var);
  T=Runtime.Safe(List.T);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Result=Runtime.Safe(Formlets.Result);
  View1=Runtime.Safe(Next.View1);
  Formlet=Runtime.Safe(Formlets.Formlet);
  Builder=Runtime.Safe(Formlet.Builder);
  ListModel=Runtime.Safe(Next.ListModel);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Array=Runtime.Safe(Next.Array);
  Key=Runtime.Safe(Next.Key);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Submitter=Runtime.Safe(Next.Submitter);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  Option=Runtime.Safe(Global.WebSharper.Option);
  RegExp=Runtime.Safe(Global.RegExp);
  return Validation=Runtime.Safe(Formlets.Validation);
 });
 Runtime.OnLoad(function()
 {
  Formlet.Do();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Strings,Exception,Data,Pervasives,jQuery,Concurrency,IO,JSRuntime,Arrays,Operators,Array,Option,Unchecked,Guid,String,WBRuntime,List,JavaScript,Pervasives1;
 Runtime.Define(Global,{
  WebSharper:{
   Data:{
    IO:{
     asyncReadTextAtRuntime:function(forFSI,defaultResolutionFolder,resolutionFolder,formatName,encodingStr,uri)
     {
      var arg00;
      arg00=function(tupledArg)
      {
       var ok,ko,_arg5,l,patternInput,uri1,jsonp,settings,_,fn,value;
       ok=tupledArg[0];
       ko=tupledArg[1];
       _arg5=tupledArg[2];
       l=uri.toLowerCase();
       patternInput=Strings.StartsWith(l,"jsonp|")?[uri.substring(6),true]:Strings.StartsWith(l,"json|")?[uri.substring(5),false]:[uri,false];
       uri1=patternInput[0];
       jsonp=patternInput[1];
       settings={
        dataType:"json",
        success:function(data)
        {
         return ok(data);
        },
        error:function(_arg3,_arg4,err)
        {
         return ko(Exception.New1(err));
        }
       };
       if(jsonp)
        {
         fn=Pervasives.randomFunctionName();
         settings.dataType="jsonp";
         settings.jsonp="prefix";
         _=void(settings.jsonpCallback="jsonp"+fn);
        }
       else
        {
         _=null;
        }
       value=jQuery.ajax(uri1,settings);
       return;
      };
      return Concurrency.FromContinuations(arg00);
     },
     asyncReadTextAtRuntimeWithDesignTimeRules:function(defaultResolutionFolder,resolutionFolder,formatName,encodingStr,uri)
     {
      return IO.asyncReadTextAtRuntime(false,defaultResolutionFolder,resolutionFolder,formatName,encodingStr,uri);
     }
    },
    JSRuntime:{
     GetArrayChildByTypeTag:function(value,cultureStr,tagCode)
     {
      var arr,x;
      x=function()
      {
       return this;
      };
      arr=JSRuntime.GetArrayChildrenByTypeTag(value,cultureStr,tagCode,x);
      return Arrays.length(arr)===1?Arrays.get(arr,0):Operators.FailWith("JSON mismatch: Expected single value, but found multiple.");
     },
     GetArrayChildrenByTypeTag:function(doc,cultureStr,tagCode,mapping)
     {
      var _,chooser,mapping1,array;
      if(Array.isArray(doc))
       {
        chooser=function(value)
        {
         return JSRuntime.matchTag(tagCode,value);
        };
        mapping1=function(x)
        {
         return function()
         {
          return mapping.call(arguments[0]);
         }(x);
        };
        array=Arrays.choose(chooser,doc);
        _=Arrays.map(mapping1,array);
       }
      else
       {
        _=Operators.FailWith("JSON mismatch: Expected Array node");
       }
      return _;
     },
     TryGetArrayChildByTypeTag:function(doc,cultureStr,tagCode,mapping)
     {
      var arr;
      arr=JSRuntime.GetArrayChildrenByTypeTag(doc,cultureStr,tagCode,mapping);
      return Arrays.length(arr)===1?{
       $:1,
       $0:Arrays.get(arr,0)
      }:Arrays.length(arr)===0?{
       $:0
      }:Operators.FailWith("JSON mismatch: Expected Array with single or no elements.");
     },
     TryGetValueByTypeTag:function(doc,cultureStr,tagCode,mapping)
     {
      var mapping1,option;
      mapping1=function(x)
      {
       return function()
       {
        return mapping.call(arguments[0]);
       }(x);
      };
      option=JSRuntime.matchTag(tagCode,doc);
      return Option.map(mapping1,option);
     },
     matchTag:function(tagCode,value)
     {
      var _,_1,_2,_3,v;
      if(value==null)
       {
        _={
         $:0
        };
       }
      else
       {
        if(Unchecked.Equals(typeof value,"boolean")?tagCode==="Boolean":false)
         {
          _1={
           $:1,
           $0:value
          };
         }
        else
         {
          if(Unchecked.Equals(typeof value,"number")?tagCode==="Number":false)
           {
            _2={
             $:1,
             $0:value
            };
           }
          else
           {
            if(Unchecked.Equals(typeof value,"string")?tagCode==="Number":false)
             {
              v=1*value;
              _3=Global.isNaN(v)?{
               $:0
              }:{
               $:1,
               $0:v
              };
             }
            else
             {
              _3=(Unchecked.Equals(typeof value,"string")?tagCode==="String":false)?{
               $:1,
               $0:value
              }:(Array.isArray(value)?tagCode==="Array":false)?{
               $:1,
               $0:value
              }:(Unchecked.Equals(typeof value,"object")?tagCode==="Record":false)?{
               $:1,
               $0:value
              }:{
               $:0
              };
             }
            _2=_3;
           }
          _1=_2;
         }
        _=_1;
       }
      return _;
     }
    },
    Pervasives:{
     randomFunctionName:function()
     {
      var copyOfStruct;
      copyOfStruct=Guid.NewGuid();
      return Strings.ReplaceChar(String(copyOfStruct).toLowerCase(),45,95);
     }
    },
    TxtRuntime:{
     AsyncMap:function(comp,mapping)
     {
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(comp,function(_arg1)
       {
        return Concurrency.Return(function()
        {
         return mapping.call(arguments[0]);
        }(_arg1));
       });
      });
     }
    },
    Utils:{
     HasProperty:function(x,prop)
     {
      var v;
      v=x[prop];
      return!Unchecked.Equals(typeof v,"undefined")?true:false;
     }
    },
    WBRuntime:{
     WorldBankRuntime:Runtime.Class({},{
      AsyncGetIndicator:function(country,indicator)
      {
       return Concurrency.FromContinuations(function(tupledArg)
       {
        var ok,ko,_arg1,guid,wb,countryCode,url,value;
        ok=tupledArg[0];
        ko=tupledArg[1];
        _arg1=tupledArg[2];
        guid=Pervasives.randomFunctionName();
        wb=country.Context;
        countryCode=country.Code;
        url=WBRuntime.worldBankUrl(wb,List.ofArray(["countries",countryCode,"indicators",indicator]),List.ofArray([["date","1900:2050"],["format","jsonp"]]));
        value=jQuery.ajax({
         url:url,
         dataType:"jsonp",
         jsonp:"prefix",
         jsonpCallback:"jsonp"+guid,
         error:function(jqXHR,textStatus,error)
         {
          return ko(Exception.New1(textStatus+error));
         },
         success:function(data)
         {
          var chooser,array,array1,res;
          chooser=function(e)
          {
           return e.value==null?{
            $:0
           }:{
            $:1,
            $0:[e.date,e.value]
           };
          };
          array=Arrays.get(data,1);
          array1=Arrays.choose(chooser,array);
          res=array1.slice().reverse();
          return ok(Pervasives1.NewFromList(res));
         }
        });
        return;
       });
      },
      GetCountry:function(countries,code,name)
      {
       return{
        Context:countries,
        Code:code,
        Name:name
       };
      },
      GetIndicators:function(country)
      {
       return country;
      }
     }),
     worldBankUrl:function(wb,functions,props)
     {
      var mapping,strings,mapping1,strings1;
      mapping=function(m)
      {
       return"/"+Global.encodeURIComponent(m);
      };
      strings=List.map(mapping,functions);
      mapping1=function(tupledArg)
      {
       var key,value;
       key=tupledArg[0];
       value=tupledArg[1];
       return"&"+key+"="+Global.encodeURIComponent(value);
      };
      strings1=List.map(mapping1,props);
      return wb.serviceUrl+"/"+Strings.concat("",strings)+"?per_page=1000"+Strings.concat("",strings1);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  Exception=Runtime.Safe(Global.WebSharper.Exception);
  Data=Runtime.Safe(Global.WebSharper.Data);
  Pervasives=Runtime.Safe(Data.Pervasives);
  jQuery=Runtime.Safe(Global.jQuery);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  IO=Runtime.Safe(Data.IO);
  JSRuntime=Runtime.Safe(Data.JSRuntime);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Array=Runtime.Safe(Global.Array);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Guid=Runtime.Safe(Global.WebSharper.Guid);
  String=Runtime.Safe(Global.String);
  WBRuntime=Runtime.Safe(Data.WBRuntime);
  List=Runtime.Safe(Global.WebSharper.List);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  return Pervasives1=Runtime.Safe(JavaScript.Pervasives);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Seq,Option,Control,Disposable,Arrays,FSharpEvent,Util,Event,Event1,Collections,ResizeArray,ResizeArrayProxy,EventModule,HotStream,HotStream1,Concurrency,Operators,TimeoutException,setTimeout,clearTimeout,LinkedList,T,MailboxProcessor,Observable,Observer,Ref,Observable1,List,T1,Observer1;
 Runtime.Define(Global,{
  WebSharper:{
   Control:{
    Disposable:{
     Of:function(dispose)
     {
      return{
       Dispose:dispose
      };
     }
    },
    Event:{
     Event:Runtime.Class({
      AddHandler:function(h)
      {
       return this.Handlers.Add(h);
      },
      RemoveHandler:function(h)
      {
       var predicate,objectArg,action,source,option;
       predicate=function(y)
       {
        return Unchecked.Equals(h,y);
       };
       objectArg=this.Handlers;
       action=function(arg00)
       {
        return objectArg.RemoveAt(arg00);
       };
       source=this.Handlers;
       option=Seq.tryFindIndex(predicate,source);
       return Option.iter(action,option);
      },
      Subscribe:function(observer)
      {
       var h,_this=this;
       h=function(x)
       {
        return observer.OnNext(x);
       };
       this.AddHandler(h);
       return Disposable.Of(function()
       {
        return _this.RemoveHandler(h);
       });
      },
      Trigger:function(x)
      {
       var arr,idx,h;
       arr=this.Handlers.ToArray();
       for(idx=0;idx<=arr.length-1;idx++){
        h=Arrays.get(arr,idx);
        h(x);
       }
       return;
      }
     })
    },
    EventModule:{
     Choose:function(c,e)
     {
      var r;
      r=FSharpEvent.New();
      Util.addListener(e,function(x)
      {
       var matchValue,_,y;
       matchValue=c(x);
       if(matchValue.$==0)
        {
         _=null;
        }
       else
        {
         y=matchValue.$0;
         _=r.event.Trigger(y);
        }
       return _;
      });
      return r.event;
     },
     Filter:function(ok,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return ok(x)?r.Trigger(x):null;
      });
      return r;
     },
     Map:function(f,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return r.Trigger(f(x));
      });
      return r;
     },
     Merge:function(e1,e2)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e1,function(arg00)
      {
       return r.Trigger(arg00);
      });
      Util.addListener(e2,function(arg00)
      {
       return r.Trigger(arg00);
      });
      return r;
     },
     Pairwise:function(e)
     {
      var buf,ev;
      buf=[{
       $:0
      }];
      ev=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       var matchValue,_,old;
       matchValue=buf[0];
       if(matchValue.$==1)
        {
         old=matchValue.$0;
         buf[0]={
          $:1,
          $0:x
         };
         _=ev.Trigger([old,x]);
        }
       else
        {
         _=void(buf[0]={
          $:1,
          $0:x
         });
        }
       return _;
      });
      return ev;
     },
     Partition:function(f,e)
     {
      return[EventModule.Filter(f,e),EventModule.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var state,f;
      state=[seed];
      f=function(value)
      {
       state[0]=(fold(state[0]))(value);
       return state[0];
      };
      return EventModule.Map(f,e);
     },
     Split:function(f,e)
     {
      var chooser,chooser1;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      return[EventModule.Choose(chooser,e),EventModule.Choose(chooser1,e)];
     }
    },
    FSharpEvent:Runtime.Class({},{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.event=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      return r;
     }
    }),
    HotStream:{
     HotStream:Runtime.Class({
      Subscribe:function(o)
      {
       var disp;
       this.Latest[0].$==1?o.OnNext(this.Latest[0].$0):null;
       disp=Util.subscribeTo(this.Event.event,function(v)
       {
        return o.OnNext(v);
       });
       return disp;
      },
      Trigger:function(v)
      {
       this.Latest[0]={
        $:1,
        $0:v
       };
       return this.Event.event.Trigger(v);
      }
     },{
      New:function()
      {
       return Runtime.New(HotStream1,{
        Latest:[{
         $:0
        }],
        Event:FSharpEvent.New()
       });
      }
     })
    },
    MailboxProcessor:Runtime.Class({
     PostAndAsyncReply:function(msgf,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.PostAndTryAsyncReply(msgf,timeout),function(_arg4)
       {
        var _,x;
        if(_arg4.$==1)
         {
          x=_arg4.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(TimeoutException.New());
         }
        return Concurrency.Return(_);
       });
      });
     },
     PostAndTryAsyncReply:function(msgf,timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg3,_arg4,_,arg001,waiting,arg002,value;
       ok=tupledArg[0];
       _arg3=tupledArg[1];
       _arg4=tupledArg[2];
       if(timeout1<0)
        {
         arg001=msgf(function(x)
         {
          return ok({
           $:1,
           $0:x
          });
         });
         _this.mailbox.AddLast(arg001);
         _=_this.resume();
        }
       else
        {
         waiting=[true];
         arg002=msgf(function(res)
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:1,
             $0:res
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         });
         _this.mailbox.AddLast(arg002);
         _this.resume();
         value=setTimeout(function()
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:0
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         },timeout1);
         _=void value;
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     Receive:function(timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryReceive(timeout),function(_arg3)
       {
        var _,x;
        if(_arg3.$==1)
         {
          x=_arg3.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(TimeoutException.New());
         }
        return Concurrency.Return(_);
       });
      });
     },
     Scan:function(scanner,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryScan(scanner,timeout),function(_arg8)
       {
        var _,x;
        if(_arg8.$==1)
         {
          x=_arg8.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(TimeoutException.New());
         }
        return Concurrency.Return(_);
       });
      });
     },
     Start:function()
     {
      var _,a,_this=this;
      if(this.started)
       {
        _=Operators.FailWith("The MailboxProcessor has already been started.");
       }
      else
       {
        this.started=true;
        a=Concurrency.Delay(function()
        {
         return Concurrency.TryWith(Concurrency.Delay(function()
         {
          return Concurrency.Bind(_this.initial.call(null,_this),function()
          {
           return Concurrency.Return(null);
          });
         }),function(_arg2)
         {
          _this.errorEvent.event.Trigger(_arg2);
          return Concurrency.Return(null);
         });
        });
        _=_this.startAsync(a);
       }
      return _;
     },
     TryReceive:function(timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg1,_arg2,_,_1,arg0,waiting,pending,arg02,arg03;
       ok=tupledArg[0];
       _arg1=tupledArg[1];
       _arg2=tupledArg[2];
       if(Unchecked.Equals(_this.mailbox.get_First(),null))
        {
         if(timeout1<0)
          {
           arg0=Concurrency.Delay(function()
           {
            var arg01;
            arg01=_this.dequeue();
            ok({
             $:1,
             $0:arg01
            });
            return Concurrency.Return(null);
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg0
           });
          }
         else
          {
           waiting=[true];
           pending=setTimeout(function()
           {
            var _2;
            if(waiting[0])
             {
              waiting[0]=false;
              _this.savedCont={
               $:0
              };
              _2=ok({
               $:0
              });
             }
            else
             {
              _2=null;
             }
            return _2;
           },timeout1);
           arg02=Concurrency.Delay(function()
           {
            var _2,arg01;
            if(waiting[0])
             {
              waiting[0]=false;
              clearTimeout(pending);
              arg01=_this.dequeue();
              ok({
               $:1,
               $0:arg01
              });
              _2=Concurrency.Return(null);
             }
            else
             {
              _2=Concurrency.Return(null);
             }
            return _2;
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg02
           });
          }
         _=_1;
        }
       else
        {
         arg03=_this.dequeue();
         _=ok({
          $:1,
          $0:arg03
         });
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     TryScan:function(scanner,timeout)
     {
      var timeout1,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      return Concurrency.Delay(function()
      {
       var scanInbox,matchValue1,_1,found1,arg00;
       scanInbox=function()
       {
        var m,found,matchValue,_;
        m=_this.mailbox.get_First();
        found={
         $:0
        };
        while(!Unchecked.Equals(m,null))
         {
          matchValue=scanner(m.v);
          if(matchValue.$==0)
           {
            _=m=m.n;
           }
          else
           {
            _this.mailbox.Remove(m);
            m=null;
            _=found=matchValue;
           }
         }
        return found;
       };
       matchValue1=scanInbox(null);
       if(matchValue1.$==1)
        {
         found1=matchValue1.$0;
         _1=Concurrency.Bind(found1,function(_arg5)
         {
          return Concurrency.Return({
           $:1,
           $0:_arg5
          });
         });
        }
       else
        {
         arg00=function(tupledArg)
         {
          var ok,_arg5,_arg6,_,scanNext,waiting,pending,scanNext1;
          ok=tupledArg[0];
          _arg5=tupledArg[1];
          _arg6=tupledArg[2];
          if(timeout1<0)
           {
            scanNext=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg61)
                {
                 ok({
                  $:1,
                  $0:_arg61
                 });
                 return Concurrency.Return(null);
                });
               }
              else
               {
                scanNext(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext(null);
           }
          else
           {
            waiting=[true];
            pending=setTimeout(function()
            {
             var _2;
             if(waiting[0])
              {
               waiting[0]=false;
               _this.savedCont={
                $:0
               };
               _2=ok({
                $:0
               });
              }
             else
              {
               _2=null;
              }
             return _2;
            },timeout1);
            scanNext1=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg7)
                {
                 var _3;
                 if(waiting[0])
                  {
                   waiting[0]=false;
                   clearTimeout(pending);
                   ok({
                    $:1,
                    $0:_arg7
                   });
                   _3=Concurrency.Return(null);
                  }
                 else
                  {
                   _3=Concurrency.Return(null);
                  }
                 return _3;
                });
               }
              else
               {
                scanNext1(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext1(null);
           }
          return _;
         };
         _1=Concurrency.FromContinuations(arg00);
        }
       return _1;
      });
     },
     dequeue:function()
     {
      var f;
      f=this.mailbox.get_First().v;
      this.mailbox.RemoveFirst();
      return f;
     },
     get_CurrentQueueLength:function()
     {
      return this.mailbox.get_Count();
     },
     get_DefaultTimeout:function()
     {
      return this["DefaultTimeout@"];
     },
     get_Error:function()
     {
      return this.errorEvent.event;
     },
     resume:function()
     {
      var matchValue,_,c;
      matchValue=this.savedCont;
      if(matchValue.$==1)
       {
        c=matchValue.$0;
        this.savedCont={
         $:0
        };
        _=this.startAsync(c);
       }
      else
       {
        _=null;
       }
      return _;
     },
     set_DefaultTimeout:function(v)
     {
      this["DefaultTimeout@"]=v;
      return;
     },
     startAsync:function(a)
     {
      return Concurrency.Start(a,this.token);
     }
    },{
     New:function(initial,token)
     {
      var r,matchValue,_,ct,value;
      r=Runtime.New(this,{});
      r.initial=initial;
      r.token=token;
      r.started=false;
      r.errorEvent=FSharpEvent.New();
      r.mailbox=T.New();
      r.savedCont={
       $:0
      };
      matchValue=r.token;
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        ct=matchValue.$0;
        value=Concurrency.Register(ct,function()
        {
         return function()
         {
          return r.resume();
         }();
        });
        _=void value;
       }
      r["DefaultTimeout@"]=-1;
      return r;
     },
     Start:function(initial,token)
     {
      var mb;
      mb=MailboxProcessor.New(initial,token);
      mb.Start();
      return mb;
     }
    }),
    Observable:{
     Aggregate:function(io,seed,fold)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Choose:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v);
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     CombineLatest:function(io1,io2,f)
     {
      var f1;
      f1=function(o)
      {
       var lv1,lv2,update,onNext,o1,onNext1,o2,d1,d2;
       lv1=[{
        $:0
       }];
       lv2=[{
        $:0
       }];
       update=function()
       {
        var matchValue,_,_1,v1,v2;
        matchValue=[lv1[0],lv2[0]];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            _1=Observable.Protect(function()
            {
             return(f(v1))(v2);
            },function(arg00)
            {
             return o.OnNext(arg00);
            },function(arg00)
            {
             return o.OnError(arg00);
            });
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       onNext=function(x)
       {
        lv1[0]={
         $:1,
         $0:x
        };
        return update(null);
       };
       o1=Observer.New(onNext,function()
       {
       },function()
       {
       });
       onNext1=function(y)
       {
        lv2[0]={
         $:1,
         $0:y
        };
        return update(null);
       };
       o2=Observer.New(onNext1,function()
       {
       },function()
       {
       });
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.Of(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(f1);
     },
     Concat:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var innerDisp,outerDisp,dispose;
       innerDisp=[{
        $:0
       }];
       outerDisp=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
       },function()
       {
        var arg0;
        arg0=io2.Subscribe(o);
        innerDisp[0]={
         $:1,
         $0:arg0
        };
       }));
       dispose=function()
       {
        innerDisp[0].$==1?innerDisp[0].$0.Dispose():null;
        return outerDisp.Dispose();
       };
       return Disposable.Of(dispose);
      };
      return Observable.New(f);
     },
     Drop:function(count,io)
     {
      var f;
      f=function(o1)
      {
       var index,on,arg00;
       index=[0];
       on=function(v)
       {
        Ref.incr(index);
        return index[0]>count?o1.OnNext(v):null;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Filter:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v)?{
          $:1,
          $0:v
         }:{
          $:0
         };
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Map:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return f(v);
        },function(arg00)
        {
         return o1.OnNext(arg00);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Merge:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var completed1,completed2,arg00,disp1,arg002,disp2;
       completed1=[false];
       completed2=[false];
       arg00=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed1[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp1=io1.Subscribe(arg00);
       arg002=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed2[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp2=io2.Subscribe(arg002);
       return Disposable.Of(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return Observable.New(f);
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.Of(function()
       {
       });
      });
     },
     New:function(f)
     {
      return Runtime.New(Observable1,{
       Subscribe1:f
      });
     },
     Observable:Runtime.Class({
      Subscribe:function(observer)
      {
       return this.Subscribe1.call(null,observer);
      }
     }),
     Of:function(f)
     {
      return Observable.New(function(o)
      {
       return Disposable.Of(f(function(x)
       {
        return o.OnNext(x);
       }));
      });
     },
     Protect:function(f,succeed,fail)
     {
      var matchValue,_,e,_1,e1,x;
      try
      {
       _={
        $:0,
        $0:f(null)
       };
      }
      catch(e)
      {
       _={
        $:1,
        $0:e
       };
      }
      matchValue=_;
      if(matchValue.$==1)
       {
        e1=matchValue.$0;
        _1=fail(e1);
       }
      else
       {
        x=matchValue.$0;
        _1=succeed(x);
       }
      return _1;
     },
     Range:function(start,count)
     {
      var f;
      f=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp=[function()
       {
       }];
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(v)
        {
         return o.OnNext(v);
        });
        disp[0]=function()
        {
         disp[0].call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.Of(function()
       {
        disp[0].call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       var _,xs,x,rest;
       if(ios1.$==1)
        {
         xs=ios1.$1;
         x=ios1.$0;
         rest=sequence(xs);
         _=Observable.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T1,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         _=Observable.Return(Runtime.New(T1,{
          $:0
         }));
        }
       return _;
      };
      return sequence(List.ofSeq(ios));
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp,disp1;
       index=[0];
       disp=[{
        $:0
       }];
       disp1=Util.subscribeTo(io,function(o1)
       {
        var currentIndex,arg0,d;
        Ref.incr(index);
        disp[0].$==1?disp[0].$0.Dispose():null;
        currentIndex=index[0];
        arg0=Util.subscribeTo(o1,function(v)
        {
         return currentIndex===index[0]?o.OnNext(v):null;
        });
        d={
         $:1,
         $0:arg0
        };
        disp[0]=d;
        return;
       });
       return disp1;
      });
     }
    },
    ObservableModule:{
     Pairwise:function(e)
     {
      var f;
      f=function(o1)
      {
       var last,on,arg00;
       last=[{
        $:0
       }];
       on=function(v)
       {
        var matchValue,_,l;
        matchValue=last[0];
        if(matchValue.$==1)
         {
          l=matchValue.$0;
          _=o1.OnNext([l,v]);
         }
        else
         {
          _=null;
         }
        last[0]={
         $:1,
         $0:v
        };
        return;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Partition:function(f,e)
     {
      return[Observable.Filter(f,e),Observable.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Split:function(f,e)
     {
      var chooser,left,chooser1,right;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      left=Observable.Choose(chooser,e);
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      right=Observable.Choose(chooser1,e);
      return[left,right];
     }
    },
    Observer:{
     New:function(f,e,c)
     {
      return Runtime.New(Observer1,{
       onNext:f,
       onError:e,
       onCompleted:c
      });
     },
     Observer:Runtime.Class({
      OnCompleted:function()
      {
       return this.onCompleted.call(null,null);
      },
      OnError:function(e)
      {
       return this.onError.call(null,e);
      },
      OnNext:function(x)
      {
       return this.onNext.call(null,x);
      }
     }),
     Of:function(f)
     {
      return Runtime.New(Observer1,{
       onNext:function(x)
       {
        return f(x);
       },
       onError:function(x)
       {
        return Operators.Raise(x);
       },
       onCompleted:function()
       {
        return null;
       }
      });
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Control=Runtime.Safe(Global.WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  Event1=Runtime.Safe(Event.Event);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  HotStream1=Runtime.Safe(HotStream.HotStream);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  TimeoutException=Runtime.Safe(Global.WebSharper.TimeoutException);
  setTimeout=Runtime.Safe(Global.setTimeout);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  T=Runtime.Safe(LinkedList.T);
  MailboxProcessor=Runtime.Safe(Control.MailboxProcessor);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Observable1=Runtime.Safe(Observable.Observable);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  return Observer1=Runtime.Safe(Observer.Observer);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,IntelliFactory,Reactive,Disposable,HotStream,Control,FSharpEvent,Observer,Observable,Util,Collections,Dictionary,Ref,Seq,Reactive1,Reactive2,List,T;
 Runtime.Define(Global,{
  IntelliFactory:{
   Reactive:{
    Disposable:Runtime.Class({
     Dispose:function()
     {
      return this.Dispose1.call(null,null);
     }
    },{
     New:function(d)
     {
      return Runtime.New(Disposable,{
       Dispose1:d
      });
     }
    }),
    HotStream:Runtime.Class({
     Subscribe:function(o)
     {
      this.Latest[0].$==1?o.OnNext(this.Latest[0].$0):null;
      return this.Event.event.Subscribe(o);
     },
     Trigger:function(v)
     {
      this.Latest[0]={
       $:1,
       $0:v
      };
      return this.Event.event.Trigger(v);
     }
    },{
     New:function(x)
     {
      var value;
      value={
       $:1,
       $0:x
      };
      return Runtime.New(HotStream,{
       Latest:[value],
       Event:FSharpEvent.New()
      });
     },
     New1:function()
     {
      return Runtime.New(HotStream,{
       Latest:[{
        $:0
       }],
       Event:FSharpEvent.New()
      });
     }
    }),
    Observable:Runtime.Class({
     Subscribe:function(o)
     {
      return this.OnSubscribe.call(null,o);
     },
     SubscribeWith:function(onNext,onComplete)
     {
      return this.OnSubscribe.call(null,Observer.New(onNext,onComplete));
     }
    },{
     New:function(f)
     {
      return Runtime.New(Observable,{
       OnSubscribe:f
      });
     }
    }),
    Observer:Runtime.Class({
     OnCompleted:function()
     {
      return this.OnCompleted1.call(null,null);
     },
     OnError:function()
     {
      return null;
     },
     OnNext:function(t)
     {
      return this.OnNext1.call(null,t);
     }
    },{
     New:function(onNext,onComplete)
     {
      return Runtime.New(Observer,{
       OnNext1:onNext,
       OnCompleted1:onComplete
      });
     }
    }),
    Reactive:{
     Aggregate:function(io,seed,acc)
     {
      return Observable.New(function(o)
      {
       var state;
       state=[seed];
       return Util.subscribeTo(io,function(value)
       {
        state[0]=(acc(state[0]))(value);
        return o.OnNext(state[0]);
       });
      });
     },
     Choose:function(io,f)
     {
      var arg00;
      arg00=function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        var matchValue,_,v1;
        matchValue=f(v);
        if(matchValue.$==0)
         {
          _=null;
         }
        else
         {
          v1=matchValue.$0;
          _=o1.OnNext(v1);
         }
        return _;
       });
      };
      return Observable.New(arg00);
     },
     CollectLatest:function(outer)
     {
      return Observable.New(function(o)
      {
       var dict,index;
       dict=Dictionary.New12();
       index=[0];
       return Util.subscribeTo(outer,function(inner)
       {
        var currentIndex,value;
        Ref.incr(index);
        currentIndex=index[0];
        value=Util.subscribeTo(inner,function(value1)
        {
         var arg00;
         dict.set_Item(currentIndex,value1);
         arg00=Seq.delay(function()
         {
          return Seq.map(function(pair)
          {
           return pair.V;
          },dict);
         });
         return o.OnNext(arg00);
        });
        return;
       });
      });
     },
     CombineLast:function(io1,io2,f)
     {
      var arg00;
      arg00=function(o)
      {
       var lv1s,lv2s,update,onNext,arg10,o1,onNext1,arg101,o2,d1,d2;
       lv1s=[];
       lv2s=[];
       update=function()
       {
        var _,v1,v2;
        if(lv1s.length>0?lv2s.length>0:false)
         {
          v1=lv1s.shift();
          v2=lv2s.shift();
          _=o.OnNext((f(v1))(v2));
         }
        else
         {
          _=null;
         }
        return _;
       };
       onNext=function(x)
       {
        lv1s.push(x);
        return update(null);
       };
       arg10=function()
       {
       };
       o1=Observer.New(onNext,arg10);
       onNext1=function(y)
       {
        lv2s.push(y);
        return update(null);
       };
       arg101=function()
       {
       };
       o2=Observer.New(onNext1,arg101);
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.New(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(arg00);
     },
     CombineLatest:function(io1,io2,f)
     {
      var arg00;
      arg00=function(o)
      {
       var lv1,lv2,update,onNext,arg10,o1,onNext1,arg101,o2,d1,d2;
       lv1=[{
        $:0
       }];
       lv2=[{
        $:0
       }];
       update=function()
       {
        var matchValue,_,_1,v1,v2;
        matchValue=[lv1[0],lv2[0]];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            _1=o.OnNext((f(v1))(v2));
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       onNext=function(x)
       {
        lv1[0]={
         $:1,
         $0:x
        };
        return update(null);
       };
       arg10=function()
       {
       };
       o1=Observer.New(onNext,arg10);
       onNext1=function(y)
       {
        lv2[0]={
         $:1,
         $0:y
        };
        return update(null);
       };
       arg101=function()
       {
       };
       o2=Observer.New(onNext1,arg101);
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.New(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(arg00);
     },
     Concat:function(io1,io2)
     {
      var arg00;
      arg00=function(o)
      {
       var innerDisp,arg001,arg10,arg003,outerDisp;
       innerDisp=[{
        $:0
       }];
       arg001=function(arg002)
       {
        return o.OnNext(arg002);
       };
       arg10=function()
       {
        innerDisp[0]={
         $:1,
         $0:io2.Subscribe(o)
        };
       };
       arg003=Observer.New(arg001,arg10);
       outerDisp=io1.Subscribe(arg003);
       return Disposable.New(function()
       {
        innerDisp[0].$==1?innerDisp[0].$0.Dispose():null;
        return outerDisp.Dispose();
       });
      };
      return Observable.New(arg00);
     },
     Default:Runtime.Field(function()
     {
      return Reactive2.New();
     }),
     Drop:function(io,count)
     {
      var arg00;
      arg00=function(o1)
      {
       var index;
       index=[0];
       return Util.subscribeTo(io,function(v)
       {
        Ref.incr(index);
        return index[0]>count?o1.OnNext(v):null;
       });
      };
      return Observable.New(arg00);
     },
     Heat:function(io)
     {
      var s;
      s=HotStream.New1();
      Util.subscribeTo(io,function(arg00)
      {
       return s.Trigger(arg00);
      });
      return s;
     },
     Merge:function(io1,io2)
     {
      var arg00;
      arg00=function(o)
      {
       var completed1,completed2,arg001,arg10,arg003,disp1,arg004,arg101,arg005,disp2;
       completed1=[false];
       completed2=[false];
       arg001=function(arg002)
       {
        return o.OnNext(arg002);
       };
       arg10=function()
       {
        completed1[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       };
       arg003=Observer.New(arg001,arg10);
       disp1=io1.Subscribe(arg003);
       arg004=function(arg002)
       {
        return o.OnNext(arg002);
       };
       arg101=function()
       {
        completed2[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       };
       arg005=Observer.New(arg004,arg101);
       disp2=io2.Subscribe(arg005);
       return Disposable.New(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return Observable.New(arg00);
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.New(function()
       {
       });
      });
     },
     Range:function(start,count)
     {
      var arg00;
      arg00=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.New(function()
       {
       });
      };
      return Observable.New(arg00);
     },
     Reactive:Runtime.Class({
      Aggregate:function(io,s,a)
      {
       return Reactive1.Aggregate(io,s,a);
      },
      Choose:function(io,f)
      {
       return Reactive1.Choose(io,f);
      },
      CollectLatest:function(io)
      {
       return Reactive1.CollectLatest(io);
      },
      CombineLatest:function(io1,io2,f)
      {
       return Reactive1.CombineLatest(io1,io2,f);
      },
      Concat:function(io1,io2)
      {
       return Reactive1.Concat(io1,io2);
      },
      Drop:function(io,count)
      {
       return Reactive1.Drop(io,count);
      },
      Heat:function(io)
      {
       return Reactive1.Heat(io);
      },
      Merge:function(io1,io2)
      {
       return Reactive1.Merge(io1,io2);
      },
      Never:function()
      {
       return Reactive1.Never();
      },
      Return:function(x)
      {
       return Reactive1.Return(x);
      },
      Select:function(io,f)
      {
       return Reactive1.Select(io,f);
      },
      SelectMany:function(io)
      {
       return Reactive1.SelectMany(io);
      },
      Sequence:function(ios)
      {
       return Reactive1.Sequence(ios);
      },
      Switch:function(io)
      {
       return Reactive1.Switch(io);
      },
      Where:function(io,f)
      {
       return Reactive1.Where(io,f);
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.New(function()
       {
       });
      };
      return Observable.New(f);
     },
     Select:function(io,f)
     {
      return Observable.New(function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        return o1.OnNext(f(v));
       });
      });
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp=[function()
       {
       }];
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(arg00)
        {
         return o.OnNext(arg00);
        });
        disp[0]=function()
        {
         disp[0].call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.New(function()
       {
        disp[0].call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       var _,xs,x,rest;
       if(ios1.$==1)
        {
         xs=ios1.$1;
         x=ios1.$0;
         rest=sequence(xs);
         _=Reactive1.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         _=Reactive1.Return(Runtime.New(T,{
          $:0
         }));
        }
       return _;
      };
      return Reactive1.Select(sequence(List.ofSeq(ios)),function(source)
      {
       return source;
      });
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp,disp1;
       index=[0];
       disp=[{
        $:0
       }];
       disp1=Util.subscribeTo(io,function(o1)
       {
        var currentIndex,arg0,d;
        Ref.incr(index);
        disp[0].$==1?disp[0].$0.Dispose():null;
        currentIndex=index[0];
        arg0=Util.subscribeTo(o1,function(v)
        {
         return currentIndex===index[0]?o.OnNext(v):null;
        });
        d={
         $:1,
         $0:arg0
        };
        disp[0]=d;
        return;
       });
       return disp1;
      });
     },
     Where:function(io,f)
     {
      var arg00;
      arg00=function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        return f(v)?o1.OnNext(v):null;
       });
      };
      return Observable.New(arg00);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  IntelliFactory=Runtime.Safe(Global.IntelliFactory);
  Reactive=Runtime.Safe(IntelliFactory.Reactive);
  Disposable=Runtime.Safe(Reactive.Disposable);
  HotStream=Runtime.Safe(Reactive.HotStream);
  Control=Runtime.Safe(Global.WebSharper.Control);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Observer=Runtime.Safe(Reactive.Observer);
  Observable=Runtime.Safe(Reactive.Observable);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Reactive1=Runtime.Safe(Reactive.Reactive);
  Reactive2=Runtime.Safe(Reactive1.Reactive);
  List=Runtime.Safe(Global.WebSharper.List);
  return T=Runtime.Safe(List.T);
 });
 Runtime.OnLoad(function()
 {
  Reactive1.Default();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Charting,Charts,BarChart,Pervasives,CompositeChart,DoughnutChart,Seq,LineChart,PieChart,PolarAreaChart,RadarChart,Util,Control,FSharpEvent,IntelliFactory,Reactive,Reactive1,Color,Random,Reactive2,Renderers,ChartJsInternal,Operators,Option,clearTimeout,Ref,setTimeout,Arrays,Chart,Slice,Seq1,BatchUpdater,UI,Next,Doc,List,AttrProxy,AttrModule,T;
 Runtime.Define(Global,{
  WebSharper:{
   Charting:{
    Chart:Runtime.Class({},{
     Bar:function(dataset)
     {
      return BarChart.New({
       $:0,
       $0:dataset
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig());
     },
     Bar1:function(dataset)
     {
      var arg0;
      arg0=Pervasives.withIndex(dataset);
      return BarChart.New({
       $:0,
       $0:arg0
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig());
     },
     Combine:function(charts)
     {
      return CompositeChart.New(charts);
     },
     Doughnut:function(dataset)
     {
      return DoughnutChart.New({
       $:0,
       $0:dataset
      },Charts.defaultChartConfig());
     },
     Doughnut1:function(dataset)
     {
      var mapping,d;
      mapping=function(t)
      {
       return((Charts.defaultPolarData())(t[0]))(t[1]);
      };
      d=Seq.map(mapping,dataset);
      return DoughnutChart.New({
       $:0,
       $0:d
      },Charts.defaultChartConfig());
     },
     Line:function(dataset)
     {
      return LineChart.New({
       $:0,
       $0:dataset
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
     },
     Line1:function(dataset)
     {
      var arg0;
      arg0=Pervasives.withIndex(dataset);
      return LineChart.New({
       $:0,
       $0:arg0
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
     },
     Pie:function(dataset)
     {
      return PieChart.New({
       $:0,
       $0:dataset
      },Charts.defaultChartConfig());
     },
     Pie1:function(dataset)
     {
      var mapping,d;
      mapping=function(t)
      {
       return((Charts.defaultPolarData())(t[0]))(t[1]);
      };
      d=Seq.map(mapping,dataset);
      return PieChart.New({
       $:0,
       $0:d
      },Charts.defaultChartConfig());
     },
     PolarArea:function(dataset)
     {
      return PolarAreaChart.New({
       $:0,
       $0:dataset
      },Charts.defaultChartConfig());
     },
     PolarArea1:function(dataset)
     {
      var mapping,d;
      mapping=function(t)
      {
       return((Charts.defaultPolarData())(t[0]))(t[1]);
      };
      d=Seq.map(mapping,dataset);
      return PolarAreaChart.New({
       $:0,
       $0:d
      },Charts.defaultChartConfig());
     },
     Radar:function(dataset)
     {
      return RadarChart.New({
       $:0,
       $0:dataset
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
     },
     Radar1:function(dataset)
     {
      var arg0;
      arg0=Pervasives.withIndex(dataset);
      return RadarChart.New({
       $:0,
       $0:arg0
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
     }
    }),
    Charts:{
     BarChart:Runtime.Class({
      OnUpdate:function(fn)
      {
       return Util.addListener(this.event.event,fn);
      },
      UpdateData:function(data,props)
      {
       return this.event.event.Trigger([data,props]);
      },
      WithFillColor:function(color)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return BarChart.New(this.dataset,this.cfg,{
        XAxis:inputRecord.XAxis,
        YAxis:inputRecord.YAxis,
        FillColor:color,
        StrokeColor:inputRecord.StrokeColor
       });
      },
      WithStrokeColor:function(color)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return BarChart.New(this.dataset,this.cfg,{
        XAxis:inputRecord.XAxis,
        YAxis:inputRecord.YAxis,
        FillColor:inputRecord.FillColor,
        StrokeColor:color
       });
      },
      WithTitle:function(title)
      {
       this.cfg;
       return BarChart.New(this.dataset,{
        Title:title
       },this.scfg);
      },
      WithXAxis:function(xAxis)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return BarChart.New(this.dataset,this.cfg,{
        XAxis:xAxis,
        YAxis:inputRecord.YAxis,
        FillColor:inputRecord.FillColor,
        StrokeColor:inputRecord.StrokeColor
       });
      },
      WithYAxis:function(yAxis)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return BarChart.New(this.dataset,this.cfg,{
        XAxis:inputRecord.XAxis,
        YAxis:yAxis,
        FillColor:inputRecord.FillColor,
        StrokeColor:inputRecord.StrokeColor
       });
      },
      __UpdateData:function(data,props)
      {
       return this.UpdateData(data,props);
      },
      __WithFillColor:function(color)
      {
       return this.cst(this).WithFillColor(color);
      },
      __WithStrokeColor:function(color)
      {
       return this.cst(this).WithStrokeColor(color);
      },
      __WithTitle:function(title)
      {
       return this.cst(this).WithTitle(title);
      },
      __WithXAxis:function(xAxis)
      {
       return this.cst(this).WithXAxis(xAxis);
      },
      __WithYAxis:function(yAxis)
      {
       return this.cst(this).WithYAxis(yAxis);
      },
      cst:function(x)
      {
       return x;
      },
      get_Config:function()
      {
       return this.cfg;
      },
      get_DataSet:function()
      {
       return this.dataset;
      },
      get_SeriesConfig:function()
      {
       return this.scfg;
      },
      get__Config:function()
      {
       return this.cst(this).get_Config();
      },
      get__SeriesConfig:function()
      {
       return this.cst(this).get_SeriesConfig();
      }
     },{
      New:function(dataset,cfg,scfg)
      {
       var r;
       r=Runtime.New(this,{});
       r.dataset=dataset;
       r.cfg=cfg;
       r.scfg=scfg;
       r.event=FSharpEvent.New();
       return r;
      }
     }),
     CompositeChart:Runtime.Class({
      get_Charts:function()
      {
       return this.charts;
      }
     },{
      New:function(charts)
      {
       var r;
       r=Runtime.New(this,{});
       r.charts=charts;
       return r;
      }
     }),
     DataType:{
      Map:function(fn,dt)
      {
       var _,io,arg0,s,arg01;
       if(dt.$==1)
        {
         io=dt.$0;
         arg0=Reactive1.Select(io,fn);
         _={
          $:1,
          $0:arg0
         };
        }
       else
        {
         s=dt.$0;
         arg01=Seq.map(fn,s);
         _={
          $:0,
          $0:arg01
         };
        }
       return _;
      }
     },
     DoughnutChart:Runtime.Class({
      OnUpdate:function(fn)
      {
       return Util.addListener(this.event.event,fn);
      },
      UpdateData:function(data,props)
      {
       return this.event.event.Trigger([data,props]);
      },
      WithTitle:function(title)
      {
       this.cfg;
       return DoughnutChart.New(this.dataset,{
        Title:title
       });
      },
      __UpdateData:function(props,data)
      {
       return this.UpdateData(props,data);
      },
      __WithTitle:function(title)
      {
       return this.cst(this).WithTitle(title);
      },
      cst:function(x)
      {
       return x;
      },
      get_Config:function()
      {
       return this.cfg;
      },
      get_DataSet:function()
      {
       return this.dataset;
      },
      get__Config:function()
      {
       return this.cst(this).get_Config();
      },
      get__DataSet:function()
      {
       return this.cst(this).get_DataSet();
      }
     },{
      New:function(dataset,cfg)
      {
       var r;
       r=Runtime.New(this,{});
       r.dataset=dataset;
       r.cfg=cfg;
       r.event=FSharpEvent.New();
       return r;
      }
     }),
     LineChart:Runtime.Class({
      OnUpdate:function(fn)
      {
       return Util.addListener(this.event.event,fn);
      },
      UpdateData:function(data,props)
      {
       return this.event.event.Trigger([data,props]);
      },
      WithFillColor:function(color)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return LineChart.New(this.dataset,this.cfg,{
        XAxis:inputRecord.XAxis,
        YAxis:inputRecord.YAxis,
        FillColor:color,
        StrokeColor:inputRecord.StrokeColor
       },this.ccfg);
      },
      WithPointColor:function(color)
      {
       var inputRecord;
       inputRecord=this.ccfg;
       return LineChart.New(this.dataset,this.cfg,this.scfg,{
        PointColor:color,
        PointHighlightFill:inputRecord.PointHighlightFill,
        PointHighlightStroke:inputRecord.PointHighlightStroke,
        PointStrokeColor:inputRecord.PointStrokeColor
       });
      },
      WithPointHighlightFill:function(color)
      {
       var inputRecord;
       inputRecord=this.ccfg;
       return LineChart.New(this.dataset,this.cfg,this.scfg,{
        PointColor:inputRecord.PointColor,
        PointHighlightFill:color,
        PointHighlightStroke:inputRecord.PointHighlightStroke,
        PointStrokeColor:inputRecord.PointStrokeColor
       });
      },
      WithPointHighlightStroke:function(color)
      {
       return this.WithPointHighlightStroke(color);
      },
      WithPointHighlightStroke1:function(color)
      {
       var inputRecord;
       inputRecord=this.ccfg;
       return LineChart.New(this.dataset,this.cfg,this.scfg,{
        PointColor:inputRecord.PointColor,
        PointHighlightFill:inputRecord.PointHighlightFill,
        PointHighlightStroke:color,
        PointStrokeColor:inputRecord.PointStrokeColor
       });
      },
      WithPointStrokeColor:function(color)
      {
       var inputRecord;
       inputRecord=this.ccfg;
       return LineChart.New(this.dataset,this.cfg,this.scfg,{
        PointColor:inputRecord.PointColor,
        PointHighlightFill:inputRecord.PointHighlightFill,
        PointHighlightStroke:inputRecord.PointHighlightStroke,
        PointStrokeColor:color
       });
      },
      WithStrokeColor:function(color)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return LineChart.New(this.dataset,this.cfg,{
        XAxis:inputRecord.XAxis,
        YAxis:inputRecord.YAxis,
        FillColor:inputRecord.FillColor,
        StrokeColor:color
       },this.ccfg);
      },
      WithTitle:function(title)
      {
       this.cfg;
       return LineChart.New(this.dataset,{
        Title:title
       },this.scfg,this.ccfg);
      },
      WithXAxis:function(xAxis)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return LineChart.New(this.dataset,this.cfg,{
        XAxis:xAxis,
        YAxis:inputRecord.YAxis,
        FillColor:inputRecord.FillColor,
        StrokeColor:inputRecord.StrokeColor
       },this.ccfg);
      },
      WithYAxis:function(yAxis)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return LineChart.New(this.dataset,this.cfg,{
        XAxis:inputRecord.XAxis,
        YAxis:yAxis,
        FillColor:inputRecord.FillColor,
        StrokeColor:inputRecord.StrokeColor
       },this.ccfg);
      },
      __UpdateData:function(data,props)
      {
       return this.UpdateData(data,props);
      },
      __WithFillColor:function(color)
      {
       return this.WithFillColor(color);
      },
      __WithPointColor:function(color)
      {
       return this.WithPointColor(color);
      },
      __WithPointHighlightFill:function(color)
      {
       return this.WithPointHighlightFill(color);
      },
      __WithPointStrokeColor:function(color)
      {
       return this.WithPointStrokeColor(color);
      },
      __WithStrokeColor:function(color)
      {
       return this.WithStrokeColor(color);
      },
      __WithTitle:function(title)
      {
       return this.WithTitle(title);
      },
      __WithXAxis:function(xAxis)
      {
       return this.WithXAxis(xAxis);
      },
      __WithYAxis:function(yAxis)
      {
       return this.WithYAxis(yAxis);
      },
      get_ColorConfig:function()
      {
       return this.ccfg;
      },
      get_Config:function()
      {
       return this.cfg;
      },
      get_DataSet:function()
      {
       return this.dataset;
      },
      get_SeriesConfig:function()
      {
       return this.scfg;
      },
      get__ColorConfig:function()
      {
       return this.get_ColorConfig();
      },
      get__Config:function()
      {
       return this.get_Config();
      },
      get__SeriesConfig:function()
      {
       return this.get_SeriesConfig();
      }
     },{
      New:function(dataset,cfg,scfg,ccfg)
      {
       var r;
       r=Runtime.New(this,{});
       r.dataset=dataset;
       r.cfg=cfg;
       r.scfg=scfg;
       r.ccfg=ccfg;
       r.event=FSharpEvent.New();
       return r;
      }
     }),
     PieChart:Runtime.Class({
      OnUpdate:function(fn)
      {
       return Util.addListener(this.event.event,fn);
      },
      UpdateData:function(data,props)
      {
       return this.event.event.Trigger([data,props]);
      },
      WithTitle:function(title)
      {
       this.cfg;
       return PieChart.New(this.dataset,{
        Title:title
       });
      },
      __UpdateData:function(props,data)
      {
       return this.UpdateData(props,data);
      },
      __WithTitle:function(title)
      {
       return this.cst(this).WithTitle(title);
      },
      cst:function(x)
      {
       return x;
      },
      get_Config:function()
      {
       return this.cfg;
      },
      get_DataSet:function()
      {
       return this.dataset;
      },
      get__Config:function()
      {
       return this.cst(this).get_Config();
      },
      get__DataSet:function()
      {
       return this.cst(this).get_DataSet();
      }
     },{
      New:function(dataset,cfg)
      {
       var r;
       r=Runtime.New(this,{});
       r.dataset=dataset;
       r.cfg=cfg;
       r.event=FSharpEvent.New();
       return r;
      }
     }),
     PolarAreaChart:Runtime.Class({
      OnUpdate:function(fn)
      {
       return Util.addListener(this.event.event,fn);
      },
      UpdateData:function(props,data)
      {
       return this.event.event.Trigger([props,data]);
      },
      WithTitle:function(title)
      {
       this.cfg;
       return PolarAreaChart.New(this.dataset,{
        Title:title
       });
      },
      __DataSet:function()
      {
       return this.cst(this).get_DataSet();
      },
      __UpdateData:function(props,data)
      {
       return this.UpdateData(props,data);
      },
      __WithTitle:function(title)
      {
       return this.cst(this).WithTitle(title);
      },
      cst:function(x)
      {
       return x;
      },
      get_Config:function()
      {
       return this.cfg;
      },
      get_DataSet:function()
      {
       return this.dataset;
      },
      get__Config:function()
      {
       return this.cst(this).get_Config();
      }
     },{
      New:function(dataset,cfg)
      {
       var r;
       r=Runtime.New(this,{});
       r.dataset=dataset;
       r.cfg=cfg;
       r.event=FSharpEvent.New();
       return r;
      }
     }),
     RadarChart:Runtime.Class({
      OnUpdate:function(fn)
      {
       return Util.addListener(this.event.event,fn);
      },
      UpdateData:function(data,props)
      {
       return this.event.event.Trigger([data,props]);
      },
      WithFillColor:function(color)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return RadarChart.New(this.dataset,this.cfg,{
        XAxis:inputRecord.XAxis,
        YAxis:inputRecord.YAxis,
        FillColor:color,
        StrokeColor:inputRecord.StrokeColor
       },this.ccfg);
      },
      WithPointColor:function(color)
      {
       var inputRecord;
       inputRecord=this.ccfg;
       return RadarChart.New(this.dataset,this.cfg,this.scfg,{
        PointColor:color,
        PointHighlightFill:inputRecord.PointHighlightFill,
        PointHighlightStroke:inputRecord.PointHighlightStroke,
        PointStrokeColor:inputRecord.PointStrokeColor
       });
      },
      WithPointHighlightFill:function(color)
      {
       var inputRecord;
       inputRecord=this.ccfg;
       return RadarChart.New(this.dataset,this.cfg,this.scfg,{
        PointColor:inputRecord.PointColor,
        PointHighlightFill:color,
        PointHighlightStroke:inputRecord.PointHighlightStroke,
        PointStrokeColor:inputRecord.PointStrokeColor
       });
      },
      WithPointHighlightStroke:function(color)
      {
       return this.WithPointHighlightStroke(color);
      },
      WithPointHighlightStroke1:function(color)
      {
       var inputRecord;
       inputRecord=this.ccfg;
       return RadarChart.New(this.dataset,this.cfg,this.scfg,{
        PointColor:inputRecord.PointColor,
        PointHighlightFill:inputRecord.PointHighlightFill,
        PointHighlightStroke:color,
        PointStrokeColor:inputRecord.PointStrokeColor
       });
      },
      WithPointStrokeColor:function(color)
      {
       var inputRecord;
       inputRecord=this.ccfg;
       return RadarChart.New(this.dataset,this.cfg,this.scfg,{
        PointColor:inputRecord.PointColor,
        PointHighlightFill:inputRecord.PointHighlightFill,
        PointHighlightStroke:inputRecord.PointHighlightStroke,
        PointStrokeColor:color
       });
      },
      WithStrokeColor:function(color)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return RadarChart.New(this.dataset,this.cfg,{
        XAxis:inputRecord.XAxis,
        YAxis:inputRecord.YAxis,
        FillColor:inputRecord.FillColor,
        StrokeColor:color
       },this.ccfg);
      },
      WithTitle:function(title)
      {
       this.cfg;
       return RadarChart.New(this.dataset,{
        Title:title
       },this.scfg,this.ccfg);
      },
      WithXAxis:function(xAxis)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return RadarChart.New(this.dataset,this.cfg,{
        XAxis:xAxis,
        YAxis:inputRecord.YAxis,
        FillColor:inputRecord.FillColor,
        StrokeColor:inputRecord.StrokeColor
       },this.ccfg);
      },
      WithYAxis:function(yAxis)
      {
       var inputRecord;
       inputRecord=this.scfg;
       return RadarChart.New(this.dataset,this.cfg,{
        XAxis:inputRecord.XAxis,
        YAxis:yAxis,
        FillColor:inputRecord.FillColor,
        StrokeColor:inputRecord.StrokeColor
       },this.ccfg);
      },
      __UpdateData:function(data,props)
      {
       return this.UpdateData(data,props);
      },
      __WithFillColor:function(color)
      {
       return this.WithFillColor(color);
      },
      __WithPointColor:function(color)
      {
       return this.WithPointColor(color);
      },
      __WithPointHighlightFill:function(color)
      {
       return this.WithPointHighlightFill(color);
      },
      __WithPointStrokeColor:function(color)
      {
       return this.WithPointStrokeColor(color);
      },
      __WithStrokeColor:function(color)
      {
       return this.WithStrokeColor(color);
      },
      __WithTitle:function(title)
      {
       return this.WithTitle(title);
      },
      __WithXAxis:function(xAxis)
      {
       return this.WithXAxis(xAxis);
      },
      __WithYAxis:function(yAxis)
      {
       return this.WithYAxis(yAxis);
      },
      get_ColorConfig:function()
      {
       return this.ccfg;
      },
      get_Config:function()
      {
       return this.cfg;
      },
      get_DataSet:function()
      {
       return this.dataset;
      },
      get_SeriesConfig:function()
      {
       return this.scfg;
      },
      get__ColorConfig:function()
      {
       return this.get_ColorConfig();
      },
      get__Config:function()
      {
       return this.get_Config();
      },
      get__SeriesConfig:function()
      {
       return this.get_SeriesConfig();
      }
     },{
      New:function(dataset,cfg,scfg,ccfg)
      {
       var r;
       r=Runtime.New(this,{});
       r.dataset=dataset;
       r.cfg=cfg;
       r.scfg=scfg;
       r.ccfg=ccfg;
       r.event=FSharpEvent.New();
       return r;
      }
     }),
     defaultChartConfig:Runtime.Field(function()
     {
      return{
       Title:"Chart"
      };
     }),
     defaultColorConfig:Runtime.Field(function()
     {
      return{
       PointColor:Runtime.New(Color,{
        $:0,
        $0:220,
        $1:220,
        $2:220,
        $3:1
       }),
       PointHighlightFill:Runtime.New(Color,{
        $:1,
        $0:"#fff"
       }),
       PointHighlightStroke:Runtime.New(Color,{
        $:0,
        $0:220,
        $1:220,
        $2:220,
        $3:1
       }),
       PointStrokeColor:Runtime.New(Color,{
        $:1,
        $0:"#fff"
       })
      };
     }),
     defaultPolarData:Runtime.Field(function()
     {
      var _rand_51_1;
      _rand_51_1=Random.New();
      return function(label)
      {
       return function(data)
       {
        var r,g,b,patternInput,highlight,color;
        r=_rand_51_1.Next2(0,256);
        g=_rand_51_1.Next2(0,256);
        b=_rand_51_1.Next2(0,256);
        patternInput=[Runtime.New(Color,{
         $:0,
         $0:r,
         $1:g,
         $2:b,
         $3:1
        }),Runtime.New(Color,{
         $:0,
         $0:r,
         $1:g,
         $2:b,
         $3:0.6
        })];
        highlight=patternInput[1];
        color=patternInput[0];
        return{
         Value:data,
         Color:color,
         Highlight:highlight,
         Label:label
        };
       };
      };
     }),
     defaultSeriesChartConfig:Runtime.Field(function()
     {
      return{
       XAxis:"x",
       YAxis:"y",
       FillColor:Runtime.New(Color,{
        $:0,
        $0:220,
        $1:220,
        $2:220,
        $3:0.2
       }),
       StrokeColor:Runtime.New(Color,{
        $:0,
        $0:220,
        $1:220,
        $2:220,
        $3:1
       })
      };
     })
    },
    LiveChart:Runtime.Class({},{
     Bar:function(dataset)
     {
      return BarChart.New({
       $:1,
       $0:dataset
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig());
     },
     Bar1:function(dataset)
     {
      var arg0;
      arg0=Pervasives.streamWithLabel(dataset);
      return BarChart.New({
       $:1,
       $0:arg0
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig());
     },
     Doughnut:function(dataset)
     {
      var d;
      d=Reactive1.Select(dataset,function(t)
      {
       return((Charts.defaultPolarData())(t[0]))(t[1]);
      });
      return DoughnutChart.New({
       $:1,
       $0:d
      },Charts.defaultChartConfig());
     },
     Doughnut1:function(dataset)
     {
      return DoughnutChart.New({
       $:1,
       $0:dataset
      },Charts.defaultChartConfig());
     },
     Line:function(dataset)
     {
      return LineChart.New({
       $:1,
       $0:dataset
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
     },
     Line1:function(dataset)
     {
      var arg0;
      arg0=Pervasives.streamWithLabel(dataset);
      return LineChart.New({
       $:1,
       $0:arg0
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
     },
     Pie:function(dataset)
     {
      return PieChart.New({
       $:1,
       $0:dataset
      },Charts.defaultChartConfig());
     },
     Pie1:function(dataset)
     {
      var d;
      d=Reactive1.Select(dataset,function(t)
      {
       return((Charts.defaultPolarData())(t[0]))(t[1]);
      });
      return PieChart.New({
       $:1,
       $0:d
      },Charts.defaultChartConfig());
     },
     PolarArea:function(dataset)
     {
      return PolarAreaChart.New({
       $:1,
       $0:dataset
      },Charts.defaultChartConfig());
     },
     PolarArea1:function(dataset)
     {
      var d;
      d=Reactive1.Select(dataset,function(t)
      {
       return((Charts.defaultPolarData())(t[0]))(t[1]);
      });
      return PolarAreaChart.New({
       $:1,
       $0:d
      },Charts.defaultChartConfig());
     },
     Radar:function(dataset)
     {
      return RadarChart.New({
       $:1,
       $0:dataset
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
     },
     Radar1:function(dataset)
     {
      var arg0;
      arg0=Pervasives.streamWithLabel(dataset);
      return RadarChart.New({
       $:1,
       $0:arg0
      },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
     }
    }),
    Pervasives:{
     Color:Runtime.Class({
      toString:function()
      {
       var _,h,n,r,g,b,a;
       if(this.$==1)
        {
         h=this.$0;
         _=h;
        }
       else
        {
         if(this.$==2)
          {
           n=this.$0;
           _=n;
          }
         else
          {
           r=this.$0;
           g=this.$1;
           b=this.$2;
           a=this.$3;
           _="rgba("+Global.String(r)+", "+Global.String(g)+", "+Global.String(b)+", "+a.toFixed(6)+")";
          }
        }
       return _;
      }
     }),
     Reactive:{
      SequenceOnlyNew:function(streams)
      {
       var matchValue,_,xs,x;
       matchValue=Seq.toList(streams);
       if(matchValue.$==1)
        {
         xs=matchValue.$1;
         x=matchValue.$0;
         _=Reactive2.sequence(Reactive1.Select(x,function(value)
         {
          return[value];
         }),xs);
        }
       else
        {
         _=Reactive1.Return(Seq.empty());
        }
       return _;
      },
      sequence:function(acc,_arg1)
      {
       var _,xs,x,f;
       if(_arg1.$==1)
        {
         xs=_arg1.$1;
         x=_arg1.$0;
         f=function(o)
         {
          return function(c)
          {
           var source2;
           source2=[c];
           return Seq.append(o,source2);
          };
         };
         _=Reactive2.sequence(Reactive1.CombineLast(acc,x,f),xs);
        }
       else
        {
         _=acc;
        }
       return _;
      }
     },
     Seq:{
      headOption:function(s)
      {
       var _,arg0;
       if(Seq.isEmpty(s))
        {
         _={
          $:0
         };
        }
       else
        {
         arg0=Seq.nth(0,s);
         _={
          $:1,
          $0:arg0
         };
        }
       return _;
      }
     },
     streamWithLabel:function(stream)
     {
      var io,f;
      io=Reactive1.Aggregate(stream,[0,0],function(tupledArg)
      {
       var s;
       s=tupledArg[0];
       tupledArg[1];
       return function(c)
       {
        return[s+1,c];
       };
      });
      f=function(tupledArg)
      {
       var a,b;
       a=tupledArg[0];
       b=tupledArg[1];
       return[Global.String(a),b];
      };
      return Reactive1.Select(io,f);
     },
     withIndex:function(s)
     {
      var initializer;
      initializer=function(i)
      {
       return Global.String(i);
      };
      return Seq.zip(Seq.initInfinite(initializer),s);
     }
    },
    Renderers:{
     ChartJs:Runtime.Class({},{
      Render:function(chart,Size,Config,Window)
      {
       return ChartJsInternal.RenderCombinedRadarChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
      },
      Render1:function(chart,Size,Config,Window)
      {
       var arg0,typ;
       arg0=Operators.DefaultArg(Config,{});
       typ={
        $:0,
        $0:arg0
       };
       return ChartJsInternal.RenderPolarAreaChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),typ,Window);
      },
      Render11:function(chart,Size,Config,Window)
      {
       return ChartJsInternal.RenderRadarChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
      },
      Render12:function(chart,Size,Config,Window)
      {
       return ChartJsInternal.RenderLineChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
      },
      Render2:function(chart,Size,Config,Window)
      {
       return ChartJsInternal.RenderCombinedLineChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
      },
      Render21:function(chart,Size,Config,Window)
      {
       var arg0,typ;
       arg0=Operators.DefaultArg(Config,{});
       typ={
        $:1,
        $0:arg0
       };
       return ChartJsInternal.RenderPolarAreaChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),typ,Window);
      },
      Render3:function(chart,Size,Config,Window)
      {
       var arg0,typ;
       arg0=Operators.DefaultArg(Config,{});
       typ={
        $:2,
        $0:arg0
       };
       return ChartJsInternal.RenderPolarAreaChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),typ,Window);
      },
      Render4:function(chart,Size,Config,Window)
      {
       return ChartJsInternal.RenderBarChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
      },
      Render5:function(chart,Size,Config,Window)
      {
       return ChartJsInternal.RenderCombinedBarChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
      }
     }),
     ChartJsInternal:{
      BatchUpdater:Runtime.Class({
       Update:function(updater)
       {
        var doUpdate,x=this,option,_,msec,arg0;
        doUpdate=function()
        {
         x.handle[0]={
          $:0
         };
         x.count[0]=0;
         return updater(null);
        };
        option=x.handle[0];
        Option.iter(function(handle)
        {
         return clearTimeout(handle);
        },option);
        if(x.count[0]<x["maxCount@26"])
         {
          Ref.incr(x.count);
          msec=x["interval@25"];
          arg0=setTimeout(doUpdate,msec);
          _=void(x.handle[0]={
           $:1,
           $0:arg0
          });
         }
        else
         {
          _=doUpdate(null);
         }
        return _;
       }
      },{
       New:function(interval,maxCount)
       {
        var r;
        r=Runtime.New(this,{});
        r["interval@25"]=Operators.DefaultArg(interval,75);
        r["maxCount@26"]=Operators.DefaultArg(maxCount,10);
        r.handle=[{
         $:0
        }];
        r.count=[0];
        return r;
       }
      }),
      RenderBarChart:function(chart,size,cfg,window)
      {
       var k;
       k=function()
       {
        return function(ctx)
        {
         var initial,data,mapping,mapping1,defaultValue,options,rendered,upd,fin,dataSet,remove,add;
         initial=ChartJsInternal.mkInitial(chart.get_DataSet(),window);
         mapping=function(tuple)
         {
          return tuple[0];
         };
         mapping1=function(tuple)
         {
          return tuple[1];
         };
         data={
          labels:Arrays.map(mapping,initial),
          datasets:[{
           label:chart.get__Config().Title,
           fillColor:Global.String(chart.get__SeriesConfig().FillColor),
           strokeColor:Global.String(chart.get__SeriesConfig().StrokeColor),
           data:Arrays.map(mapping1,initial)
          }]
         };
         defaultValue={
          barShowStroke:true
         };
         options=Operators.DefaultArg(cfg,defaultValue);
         rendered=(new Chart(ctx)).Bar(data,options);
         upd=function(tupledArg)
         {
          var i,d,ds,s;
          i=tupledArg[0];
          d=tupledArg[1];
          ds=rendered.datasets;
          s=Arrays.get(ds,0).bars;
          Arrays.get(s,i).value=d(Arrays.get(s,i).value);
          return;
         };
         fin=function()
         {
          return rendered.update();
         };
         ChartJsInternal.registerUpdater(chart,upd,fin);
         dataSet=chart.get_DataSet();
         remove=function()
         {
          return function()
          {
           return rendered.removeData();
          };
         };
         add=function()
         {
          return function(tupledArg)
          {
           var label,data1;
           label=tupledArg[0];
           data1=tupledArg[1];
           return rendered.addData([data1],label);
          };
         };
         return ChartJsInternal.onEvent(dataSet,window,remove,add);
        };
       };
       return ChartJsInternal.withNewCanvas(size,k);
      },
      RenderCombinedBarChart:function(chart,size,cfg,window)
      {
       var k;
       k=function()
       {
        return function(ctx)
        {
         var chooser,source,e,labels,data,x,mapping,source2,defaultValue,options,rendered,x1,action,mapping2,source3,dataSet,streams,l,remove,add;
         chooser=function(chart1)
         {
          var matchValue,_,s,arg0;
          matchValue=chart1.get_DataSet();
          if(matchValue.$==1)
           {
            _={
             $:0
            };
           }
          else
           {
            s=matchValue.$0;
            arg0=Seq.map(function(tuple)
            {
             return tuple[0];
            },s);
            _={
             $:1,
             $0:arg0
            };
           }
          return _;
         };
         source=chart.get_Charts();
         e=Seq.choose(chooser,source);
         labels=Seq.length(e)>0?Seq.maxBy(function(source1)
         {
          return Seq.length(source1);
         },e):Seq.empty();
         x=chart.get_Charts();
         mapping=function(chart1)
         {
          var initials,mapping1;
          initials=ChartJsInternal.mkInitial(chart1.get_DataSet(),window);
          mapping1=function(tuple)
          {
           return tuple[1];
          };
          return{
           label:chart1.get__Config().Title,
           fillColor:Global.String(chart1.get__SeriesConfig().FillColor),
           strokeColor:Global.String(chart1.get__SeriesConfig().StrokeColor),
           data:Arrays.map(mapping1,initials)
          };
         };
         source2=Seq.map(mapping,x);
         data={
          labels:Seq.toArray(labels),
          datasets:Seq.toArray(source2)
         };
         defaultValue={
          barShowStroke:true
         };
         options=Operators.DefaultArg(cfg,defaultValue);
         rendered=(new Chart(ctx)).Bar(data,options);
         x1=chart.get_Charts();
         action=function(i)
         {
          return function(chart1)
          {
           var upd,fin;
           upd=function(tupledArg)
           {
            var j,d,ds,s;
            j=tupledArg[0];
            d=tupledArg[1];
            ds=rendered.datasets;
            s=Arrays.get(ds,i).bars;
            Arrays.get(s,j).value=d(Arrays.get(s,j).value);
            return;
           };
           fin=function()
           {
            return rendered.update();
           };
           return ChartJsInternal.registerUpdater(chart1,upd,fin);
          };
         };
         Seq.iteri(action,x1);
         mapping2=function(chart1)
         {
          return chart1.get_DataSet();
         };
         source3=chart.get_Charts();
         dataSet=Seq.map(mapping2,source3);
         streams=ChartJsInternal.extractStreams(dataSet);
         l=Seq.length(chart.get_Charts());
         remove=function()
         {
          return function()
          {
           return rendered.removeData();
          };
         };
         add=function()
         {
          return function(tupledArg)
          {
           var arr,label;
           arr=tupledArg[0];
           label=tupledArg[1];
           return rendered.addData(arr,label);
          };
         };
         return ChartJsInternal.onCombinedEvent(streams,l,window,remove,add);
        };
       };
       return ChartJsInternal.withNewCanvas(size,k);
      },
      RenderCombinedLineChart:function(chart,size,cfg,window)
      {
       var k;
       k=function()
       {
        return function(ctx)
        {
         var chooser,mapping,mapping1,source1,source2,x,labels,data,x1,mapping2,source3,defaultValue,options,rendered,x2,action,mapping4,source4,dataSet,streams,l,remove,add;
         chooser=function(chart1)
         {
          var matchValue,_,arg0;
          matchValue=chart1.get_DataSet();
          if(matchValue.$==1)
           {
            _={
             $:0
            };
           }
          else
           {
            matchValue.$0;
            arg0=ChartJsInternal.mkInitial(matchValue,window);
            _={
             $:1,
             $0:arg0
            };
           }
          return _;
         };
         mapping=function(tuple)
         {
          return tuple[0];
         };
         mapping1=function(source)
         {
          return Seq.map(mapping,source);
         };
         source1=chart.get_Charts();
         source2=Seq.choose(chooser,source1);
         x=Seq.map(mapping1,source2);
         labels=Seq.length(x)>0?Seq.maxBy(function(source)
         {
          return Seq.length(source);
         },x):Seq.empty();
         x1=chart.get_Charts();
         mapping2=function(chart1)
         {
          var initials,mapping3;
          initials=ChartJsInternal.mkInitial(chart1.get_DataSet(),window);
          mapping3=function(tuple)
          {
           return tuple[1];
          };
          return{
           label:chart1.get__Config().Title,
           fillColor:Global.String(chart1.get__SeriesConfig().FillColor),
           strokeColor:Global.String(chart1.get__SeriesConfig().StrokeColor),
           pointColor:Global.String(chart1.get__ColorConfig().PointColor),
           pointHighlightFill:Global.String(chart1.get__ColorConfig().PointHighlightFill),
           pointHighlightStroke:Global.String(chart1.get__ColorConfig().PointHighlightStroke),
           pointStrokeColor:Global.String(chart1.get__ColorConfig().PointStrokeColor),
           data:Arrays.map(mapping3,initials)
          };
         };
         source3=Seq.map(mapping2,x1);
         data={
          labels:Seq.toArray(labels),
          datasets:Seq.toArray(source3)
         };
         defaultValue={
          bezierCurve:false,
          datasetFill:false
         };
         options=Operators.DefaultArg(cfg,defaultValue);
         rendered=(new Chart(ctx)).Line(data,options);
         x2=chart.get_Charts();
         action=function(i)
         {
          return function(chart1)
          {
           var upd,fin;
           upd=function(tupledArg)
           {
            var j,d,ds,s;
            j=tupledArg[0];
            d=tupledArg[1];
            ds=rendered.datasets;
            s=Arrays.get(ds,i).points;
            Arrays.get(s,j).value=d(Arrays.get(s,j).value);
            return;
           };
           fin=function()
           {
            return rendered.update();
           };
           return ChartJsInternal.registerUpdater(chart1,upd,fin);
          };
         };
         Seq.iteri(action,x2);
         mapping4=function(chart1)
         {
          return chart1.get_DataSet();
         };
         source4=chart.get_Charts();
         dataSet=Seq.map(mapping4,source4);
         streams=ChartJsInternal.extractStreams(dataSet);
         l=Seq.length(chart.get_Charts());
         remove=function()
         {
          return function()
          {
           return rendered.removeData();
          };
         };
         add=function()
         {
          return function(tupledArg)
          {
           var arr,label;
           arr=tupledArg[0];
           label=tupledArg[1];
           return rendered.addData(arr,label);
          };
         };
         return ChartJsInternal.onCombinedEvent(streams,l,window,remove,add);
        };
       };
       return ChartJsInternal.withNewCanvas(size,k);
      },
      RenderCombinedRadarChart:function(chart,size,cfg,window)
      {
       var k;
       k=function()
       {
        return function(ctx)
        {
         var chooser,source,e,labels,data,x,mapping,source2,defaultValue,options,rendered,x1,action,mapping2,source3,dataSet,streams,l,remove,add;
         chooser=function(chart1)
         {
          var matchValue,_,s,arg0;
          matchValue=chart1.get_DataSet();
          if(matchValue.$==1)
           {
            _={
             $:0
            };
           }
          else
           {
            s=matchValue.$0;
            arg0=Seq.map(function(tuple)
            {
             return tuple[0];
            },s);
            _={
             $:1,
             $0:arg0
            };
           }
          return _;
         };
         source=chart.get_Charts();
         e=Seq.choose(chooser,source);
         labels=Seq.length(e)>0?Seq.maxBy(function(source1)
         {
          return Seq.length(source1);
         },e):Seq.empty();
         x=chart.get_Charts();
         mapping=function(chart1)
         {
          var initials,mapping1;
          initials=ChartJsInternal.mkInitial(chart1.get_DataSet(),window);
          mapping1=function(tuple)
          {
           return tuple[1];
          };
          return{
           label:chart1.get__Config().Title,
           fillColor:Global.String(chart1.get__SeriesConfig().FillColor),
           strokeColor:Global.String(chart1.get__SeriesConfig().StrokeColor),
           pointColor:Global.String(chart1.get__ColorConfig().PointColor),
           pointHighlightFill:Global.String(chart1.get__ColorConfig().PointHighlightFill),
           pointHighlightStroke:Global.String(chart1.get__ColorConfig().PointHighlightStroke),
           pointStrokeColor:Global.String(chart1.get__ColorConfig().PointStrokeColor),
           data:Arrays.map(mapping1,initials)
          };
         };
         source2=Seq.map(mapping,x);
         data={
          labels:Seq.toArray(labels),
          datasets:Seq.toArray(source2)
         };
         defaultValue={
          datasetFill:true,
          datasetStroke:true
         };
         options=Operators.DefaultArg(cfg,defaultValue);
         rendered=(new Chart(ctx)).Radar(data,options);
         x1=chart.get_Charts();
         action=function(i)
         {
          return function(chart1)
          {
           var upd,fin;
           upd=function(tupledArg)
           {
            var j,d,ds,s;
            j=tupledArg[0];
            d=tupledArg[1];
            ds=rendered.datasets;
            s=Arrays.get(ds,i).points;
            Arrays.get(s,j).value=d(Arrays.get(s,j).value);
            return;
           };
           fin=function()
           {
            return rendered.update();
           };
           return ChartJsInternal.registerUpdater(chart1,upd,fin);
          };
         };
         Seq.iteri(action,x1);
         mapping2=function(chart1)
         {
          return chart1.get_DataSet();
         };
         source3=chart.get_Charts();
         dataSet=Seq.map(mapping2,source3);
         streams=ChartJsInternal.extractStreams(dataSet);
         l=Seq.length(chart.get_Charts());
         remove=function()
         {
          return function()
          {
           return rendered.removeData();
          };
         };
         add=function()
         {
          return function(tupledArg)
          {
           var arr,label;
           arr=tupledArg[0];
           label=tupledArg[1];
           return rendered.addData(arr,label);
          };
         };
         return ChartJsInternal.onCombinedEvent(streams,l,window,remove,add);
        };
       };
       return ChartJsInternal.withNewCanvas(size,k);
      },
      RenderLineChart:function(chart,size,cfg,window)
      {
       var k;
       k=function()
       {
        return function(ctx)
        {
         var initial,data,mapping,mapping1,defaultValue,options,rendered,upd,fin,dataSet,remove,add;
         initial=ChartJsInternal.mkInitial(chart.get_DataSet(),window);
         mapping=function(tuple)
         {
          return tuple[0];
         };
         mapping1=function(tuple)
         {
          return tuple[1];
         };
         data={
          labels:Arrays.map(mapping,initial),
          datasets:[{
           label:chart.get__Config().Title,
           fillColor:Global.String(chart.get__SeriesConfig().FillColor),
           strokeColor:Global.String(chart.get__SeriesConfig().StrokeColor),
           pointColor:Global.String(chart.get__ColorConfig().PointColor),
           pointHighlightFill:Global.String(chart.get__ColorConfig().PointHighlightFill),
           pointHighlightStroke:Global.String(chart.get__ColorConfig().PointHighlightStroke),
           pointStrokeColor:Global.String(chart.get__ColorConfig().PointStrokeColor),
           data:Arrays.map(mapping1,initial)
          }]
         };
         defaultValue={
          bezierCurve:false,
          datasetFill:false
         };
         options=Operators.DefaultArg(cfg,defaultValue);
         rendered=(new Chart(ctx)).Line(data,options);
         upd=function(tupledArg)
         {
          var i,d,ds,s;
          i=tupledArg[0];
          d=tupledArg[1];
          ds=rendered.datasets;
          s=Arrays.get(ds,0).points;
          Arrays.get(s,i).value=d(Arrays.get(s,i).value);
          return;
         };
         fin=function()
         {
          return rendered.update();
         };
         ChartJsInternal.registerUpdater(chart,upd,fin);
         dataSet=chart.get_DataSet();
         remove=function()
         {
          return function()
          {
           return rendered.removeData();
          };
         };
         add=function()
         {
          return function(tupledArg)
          {
           var label,data1;
           label=tupledArg[0];
           data1=tupledArg[1];
           return rendered.addData([data1],label);
          };
         };
         return ChartJsInternal.onEvent(dataSet,window,remove,add);
        };
       };
       return ChartJsInternal.withNewCanvas(size,k);
      },
      RenderPolarAreaChart:function(chart,size,typ,window)
      {
       var k;
       k=function()
       {
        return function(ctx)
        {
         var initial,convert,data,rendered,_,opts,opts1,opts2,arg00,dataSet,remove,add;
         initial=ChartJsInternal.mkInitial(chart.get_DataSet(),{
          $:0
         });
         convert=function(e)
         {
          return typ.$==1?{
           color:Global.String(e.Color),
           highlight:Global.String(e.Highlight),
           value:e.Value,
           label:e.Label
          }:typ.$==2?{
           color:Global.String(e.Color),
           highlight:Global.String(e.Highlight),
           value:e.Value,
           label:e.Label
          }:{
           color:Global.String(e.Color),
           highlight:Global.String(e.Highlight),
           value:e.Value,
           label:e.Label
          };
         };
         data=Arrays.map(convert,initial);
         if(typ.$==1)
          {
           opts=typ.$0;
           _=(new Chart(ctx)).Pie(data,opts);
          }
         else
          {
           if(typ.$==2)
            {
             opts1=typ.$0;
             _=(new Chart(ctx)).Doughnut(data,opts1);
            }
           else
            {
             opts2=typ.$0;
             _=(new Chart(ctx)).PolarArea(data,opts2);
            }
          }
         rendered=_;
         arg00=function(tupledArg)
         {
          var i,d,s;
          i=tupledArg[0];
          d=tupledArg[1];
          s=rendered.segments;
          Arrays.get(s,i).value=d(Arrays.get(s,i).value);
          return rendered.update();
         };
         chart.OnUpdate(arg00);
         dataSet=chart.get_DataSet();
         remove=function()
         {
          return function()
          {
           return rendered.removeData(0);
          };
         };
         add=function(size1)
         {
          return function(data1)
          {
           return rendered.addData(convert(data1),size1);
          };
         };
         return ChartJsInternal.onEvent(dataSet,window,remove,add);
        };
       };
       return ChartJsInternal.withNewCanvas(size,k);
      },
      RenderRadarChart:function(chart,size,cfg,window)
      {
       var k;
       k=function()
       {
        return function(ctx)
        {
         var initial,data,mapping,mapping1,defaultValue,options,rendered,upd,fin,dataSet,remove,add;
         initial=ChartJsInternal.mkInitial(chart.get_DataSet(),window);
         mapping=function(tuple)
         {
          return tuple[0];
         };
         mapping1=function(tuple)
         {
          return tuple[1];
         };
         data={
          labels:Arrays.map(mapping,initial),
          datasets:[{
           label:chart.get__Config().Title,
           fillColor:Global.String(chart.get__SeriesConfig().FillColor),
           strokeColor:Global.String(chart.get__SeriesConfig().StrokeColor),
           pointColor:Global.String(chart.get__ColorConfig().PointColor),
           pointHighlightFill:Global.String(chart.get__ColorConfig().PointHighlightFill),
           pointHighlightStroke:Global.String(chart.get__ColorConfig().PointHighlightStroke),
           pointStrokeColor:Global.String(chart.get__ColorConfig().PointStrokeColor),
           data:Arrays.map(mapping1,initial)
          }]
         };
         defaultValue={
          datasetFill:true,
          datasetStroke:true
         };
         options=Operators.DefaultArg(cfg,defaultValue);
         rendered=(new Chart(ctx)).Radar(data,options);
         upd=function(tupledArg)
         {
          var i,d,ds,s;
          i=tupledArg[0];
          d=tupledArg[1];
          ds=rendered.datasets;
          s=Arrays.get(ds,0).points;
          Arrays.get(s,i).value=d(Arrays.get(s,i).value);
          return;
         };
         fin=function()
         {
          return rendered.update();
         };
         ChartJsInternal.registerUpdater(chart,upd,fin);
         dataSet=chart.get_DataSet();
         remove=function()
         {
          return function()
          {
           return rendered.removeData();
          };
         };
         add=function()
         {
          return function(tupledArg)
          {
           var label,data1;
           label=tupledArg[0];
           data1=tupledArg[1];
           return rendered.addData([data1],label);
          };
         };
         return ChartJsInternal.onEvent(dataSet,window,remove,add);
        };
       };
       return ChartJsInternal.withNewCanvas(size,k);
      },
      extractStreams:function(dataSet)
      {
       var mapping,chooser,source,_arg00_;
       mapping=function(i)
       {
        return function(data)
        {
         var _,s,arg0;
         if(data.$==0)
          {
           _={
            $:0
           };
          }
         else
          {
           s=data.$0;
           arg0=Reactive1.Select(s,function(d)
           {
            return[i,d];
           });
           _={
            $:1,
            $0:arg0
           };
          }
         return _;
        };
       };
       chooser=function(x)
       {
        return x;
       };
       source=Seq.mapi(mapping,dataSet);
       _arg00_=Seq.choose(chooser,source);
       return Reactive2.SequenceOnlyNew(_arg00_);
      },
      mkInitial:function(dataSet,window)
      {
       var _,s,folder,state;
       if(dataSet.$==0)
        {
         s=dataSet.$0;
         folder=function(s1)
         {
          return function(w)
          {
           var skp;
           skp=Arrays.length(s1)-w;
           return skp>=Arrays.length(s1)?[]:skp<=0?s1:Slice.array(s1,{
            $:1,
            $0:skp
           },{
            $:0
           });
          };
         };
         state=Seq.toArray(s);
         _=Option.fold(folder,state,window);
        }
       else
        {
         dataSet.$0;
         _=[];
        }
       return _;
      },
      onCombinedEvent:function(streams,l,window,remove,add)
      {
       var size,arg00;
       size=[0];
       arg00=function(data)
       {
        var action,arr,action1,action2,option;
        action=function(window1)
        {
         return size[0]>=window1?(remove(window1))(size[0]):null;
        };
        Option.iter(action,window);
        arr=Seq.toArray(Seq.delay(function()
        {
         return Seq.map(function()
         {
          return 0;
         },Operators.range(1,l));
        }));
        action1=function(tupledArg)
        {
         var i,_arg1,l1;
         i=tupledArg[0];
         _arg1=tupledArg[1];
         l1=_arg1[1];
         _arg1[0];
         return Arrays.set(arr,i,l1);
        };
        Seq.iter(action1,data);
        action2=function(tupledArg)
        {
         var _arg3,label;
         tupledArg[0];
         _arg3=tupledArg[1];
         label=_arg3[0];
         return(add(size[0]))([arr,label]);
        };
        option=Seq1.headOption(data);
        Option.iter(action2,option);
        return Ref.incr(size);
       };
       return Util.addListener(streams,arg00);
      },
      onEvent:function(dataSet,window,remove,add)
      {
       var _,o,size,arg00;
       if(dataSet.$==1)
        {
         o=dataSet.$0;
         size=[0];
         arg00=function(data)
         {
          var action;
          action=function(window1)
          {
           return size[0]>=window1?(remove(window1))(size[0]):null;
          };
          Option.iter(action,window);
          (add(size[0]))(data);
          return Ref.incr(size);
         };
         _=Util.addListener(o,arg00);
        }
       else
        {
         _=null;
        }
       return _;
      },
      registerUpdater:function(mChart,upd,fin)
      {
       var bu,arg00;
       bu=BatchUpdater.New({
        $:0
       },{
        $:0
       });
       arg00=function(tupledArg)
       {
        var i,d;
        i=tupledArg[0];
        d=tupledArg[1];
        upd([i,d]);
        return bu.Update(fin);
       };
       return mChart.OnUpdate(arg00);
      },
      withNewCanvas:function(size,k)
      {
       var width,height,arg00,arg001,arg002;
       width=size.$0;
       height=size.$1;
       arg00=Global.String(width);
       arg001=Global.String(height);
       arg002=function(el)
       {
        var ctx;
        ctx=el.getContext("2d");
        return(k(el))(ctx);
       };
       return Doc.Element("canvas",List.ofArray([AttrProxy.Create("width",arg00),AttrProxy.Create("height",arg001),AttrModule.OnAfterRender(arg002)]),Runtime.New(T,{
        $:0
       }));
      }
     },
     defaultSize:Runtime.Field(function()
     {
      return{
       $:0,
       $0:500,
       $1:200
      };
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Charting=Runtime.Safe(Global.WebSharper.Charting);
  Charts=Runtime.Safe(Charting.Charts);
  BarChart=Runtime.Safe(Charts.BarChart);
  Pervasives=Runtime.Safe(Charting.Pervasives);
  CompositeChart=Runtime.Safe(Charts.CompositeChart);
  DoughnutChart=Runtime.Safe(Charts.DoughnutChart);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  LineChart=Runtime.Safe(Charts.LineChart);
  PieChart=Runtime.Safe(Charts.PieChart);
  PolarAreaChart=Runtime.Safe(Charts.PolarAreaChart);
  RadarChart=Runtime.Safe(Charts.RadarChart);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Control=Runtime.Safe(Global.WebSharper.Control);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  IntelliFactory=Runtime.Safe(Global.IntelliFactory);
  Reactive=Runtime.Safe(IntelliFactory.Reactive);
  Reactive1=Runtime.Safe(Reactive.Reactive);
  Color=Runtime.Safe(Pervasives.Color);
  Random=Runtime.Safe(Global.WebSharper.Random);
  Reactive2=Runtime.Safe(Pervasives.Reactive);
  Renderers=Runtime.Safe(Charting.Renderers);
  ChartJsInternal=Runtime.Safe(Renderers.ChartJsInternal);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Option=Runtime.Safe(Global.WebSharper.Option);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  setTimeout=Runtime.Safe(Global.setTimeout);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Chart=Runtime.Safe(Global.Chart);
  Slice=Runtime.Safe(Global.WebSharper.Slice);
  Seq1=Runtime.Safe(Pervasives.Seq);
  BatchUpdater=Runtime.Safe(ChartJsInternal.BatchUpdater);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Doc=Runtime.Safe(Next.Doc);
  List=Runtime.Safe(Global.WebSharper.List);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  AttrModule=Runtime.Safe(Next.AttrModule);
  return T=Runtime.Safe(List.T);
 });
 Runtime.OnLoad(function()
 {
  Renderers.defaultSize();
  Charts.defaultSeriesChartConfig();
  Charts.defaultPolarData();
  Charts.defaultColorConfig();
  Charts.defaultChartConfig();
  return;
 });
}());

/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 1.0.2
 *
 * Copyright 2015 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */
(function(){"use strict";var t=this,i=t.Chart,e=function(t){this.canvas=t.canvas,this.ctx=t;var i=function(t,i){return t["offset"+i]?t["offset"+i]:document.defaultView.getComputedStyle(t).getPropertyValue(i)},e=this.width=i(t.canvas,"Width"),n=this.height=i(t.canvas,"Height");t.canvas.width=e,t.canvas.height=n;var e=this.width=t.canvas.width,n=this.height=t.canvas.height;return this.aspectRatio=this.width/this.height,s.retinaScale(this),this};e.defaults={global:{animation:!0,animationSteps:60,animationEasing:"easeOutQuart",showScale:!0,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleIntegersOnly:!0,scaleBeginAtZero:!1,scaleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",responsive:!1,maintainAspectRatio:!0,showTooltips:!0,customTooltips:!1,tooltipEvents:["mousemove","touchstart","touchmove","mouseout"],tooltipFillColor:"rgba(0,0,0,0.8)",tooltipFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipFontSize:14,tooltipFontStyle:"normal",tooltipFontColor:"#fff",tooltipTitleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipTitleFontSize:14,tooltipTitleFontStyle:"bold",tooltipTitleFontColor:"#fff",tooltipYPadding:6,tooltipXPadding:6,tooltipCaretSize:8,tooltipCornerRadius:6,tooltipXOffset:10,tooltipTemplate:"<%if (label){%><%=label%>: <%}%><%= value %>",multiTooltipTemplate:"<%= value %>",multiTooltipKeyBackground:"#fff",onAnimationProgress:function(){},onAnimationComplete:function(){}}},e.types={};var s=e.helpers={},n=s.each=function(t,i,e){var s=Array.prototype.slice.call(arguments,3);if(t)if(t.length===+t.length){var n;for(n=0;n<t.length;n++)i.apply(e,[t[n],n].concat(s))}else for(var o in t)i.apply(e,[t[o],o].concat(s))},o=s.clone=function(t){var i={};return n(t,function(e,s){t.hasOwnProperty(s)&&(i[s]=e)}),i},a=s.extend=function(t){return n(Array.prototype.slice.call(arguments,1),function(i){n(i,function(e,s){i.hasOwnProperty(s)&&(t[s]=e)})}),t},h=s.merge=function(){var t=Array.prototype.slice.call(arguments,0);return t.unshift({}),a.apply(null,t)},l=s.indexOf=function(t,i){if(Array.prototype.indexOf)return t.indexOf(i);for(var e=0;e<t.length;e++)if(t[e]===i)return e;return-1},r=(s.where=function(t,i){var e=[];return s.each(t,function(t){i(t)&&e.push(t)}),e},s.findNextWhere=function(t,i,e){e||(e=-1);for(var s=e+1;s<t.length;s++){var n=t[s];if(i(n))return n}},s.findPreviousWhere=function(t,i,e){e||(e=t.length);for(var s=e-1;s>=0;s--){var n=t[s];if(i(n))return n}},s.inherits=function(t){var i=this,e=t&&t.hasOwnProperty("constructor")?t.constructor:function(){return i.apply(this,arguments)},s=function(){this.constructor=e};return s.prototype=i.prototype,e.prototype=new s,e.extend=r,t&&a(e.prototype,t),e.__super__=i.prototype,e}),c=s.noop=function(){},u=s.uid=function(){var t=0;return function(){return"chart-"+t++}}(),d=s.warn=function(t){window.console&&"function"==typeof window.console.warn&&console.warn(t)},p=s.amd="function"==typeof define&&define.amd,f=s.isNumber=function(t){return!isNaN(parseFloat(t))&&isFinite(t)},g=s.max=function(t){return Math.max.apply(Math,t)},m=s.min=function(t){return Math.min.apply(Math,t)},v=(s.cap=function(t,i,e){if(f(i)){if(t>i)return i}else if(f(e)&&e>t)return e;return t},s.getDecimalPlaces=function(t){return t%1!==0&&f(t)?t.toString().split(".")[1].length:0}),S=s.radians=function(t){return t*(Math.PI/180)},x=(s.getAngleFromPoint=function(t,i){var e=i.x-t.x,s=i.y-t.y,n=Math.sqrt(e*e+s*s),o=2*Math.PI+Math.atan2(s,e);return 0>e&&0>s&&(o+=2*Math.PI),{angle:o,distance:n}},s.aliasPixel=function(t){return t%2===0?0:.5}),y=(s.splineCurve=function(t,i,e,s){var n=Math.sqrt(Math.pow(i.x-t.x,2)+Math.pow(i.y-t.y,2)),o=Math.sqrt(Math.pow(e.x-i.x,2)+Math.pow(e.y-i.y,2)),a=s*n/(n+o),h=s*o/(n+o);return{inner:{x:i.x-a*(e.x-t.x),y:i.y-a*(e.y-t.y)},outer:{x:i.x+h*(e.x-t.x),y:i.y+h*(e.y-t.y)}}},s.calculateOrderOfMagnitude=function(t){return Math.floor(Math.log(t)/Math.LN10)}),C=(s.calculateScaleRange=function(t,i,e,s,n){var o=2,a=Math.floor(i/(1.5*e)),h=o>=a,l=g(t),r=m(t);l===r&&(l+=.5,r>=.5&&!s?r-=.5:l+=.5);for(var c=Math.abs(l-r),u=y(c),d=Math.ceil(l/(1*Math.pow(10,u)))*Math.pow(10,u),p=s?0:Math.floor(r/(1*Math.pow(10,u)))*Math.pow(10,u),f=d-p,v=Math.pow(10,u),S=Math.round(f/v);(S>a||a>2*S)&&!h;)if(S>a)v*=2,S=Math.round(f/v),S%1!==0&&(h=!0);else if(n&&u>=0){if(v/2%1!==0)break;v/=2,S=Math.round(f/v)}else v/=2,S=Math.round(f/v);return h&&(S=o,v=f/S),{steps:S,stepValue:v,min:p,max:p+S*v}},s.template=function(t,i){function e(t,i){var e=/\W/.test(t)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+t.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):s[t]=s[t];return i?e(i):e}if(t instanceof Function)return t(i);var s={};return e(t,i)}),w=(s.generateLabels=function(t,i,e,s){var o=new Array(i);return labelTemplateString&&n(o,function(i,n){o[n]=C(t,{value:e+s*(n+1)})}),o},s.easingEffects={linear:function(t){return t},easeInQuad:function(t){return t*t},easeOutQuad:function(t){return-1*t*(t-2)},easeInOutQuad:function(t){return(t/=.5)<1?.5*t*t:-0.5*(--t*(t-2)-1)},easeInCubic:function(t){return t*t*t},easeOutCubic:function(t){return 1*((t=t/1-1)*t*t+1)},easeInOutCubic:function(t){return(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},easeInQuart:function(t){return t*t*t*t},easeOutQuart:function(t){return-1*((t=t/1-1)*t*t*t-1)},easeInOutQuart:function(t){return(t/=.5)<1?.5*t*t*t*t:-0.5*((t-=2)*t*t*t-2)},easeInQuint:function(t){return 1*(t/=1)*t*t*t*t},easeOutQuint:function(t){return 1*((t=t/1-1)*t*t*t*t+1)},easeInOutQuint:function(t){return(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},easeInSine:function(t){return-1*Math.cos(t/1*(Math.PI/2))+1},easeOutSine:function(t){return 1*Math.sin(t/1*(Math.PI/2))},easeInOutSine:function(t){return-0.5*(Math.cos(Math.PI*t/1)-1)},easeInExpo:function(t){return 0===t?1:1*Math.pow(2,10*(t/1-1))},easeOutExpo:function(t){return 1===t?1:1*(-Math.pow(2,-10*t/1)+1)},easeInOutExpo:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(-Math.pow(2,-10*--t)+2)},easeInCirc:function(t){return t>=1?t:-1*(Math.sqrt(1-(t/=1)*t)-1)},easeOutCirc:function(t){return 1*Math.sqrt(1-(t=t/1-1)*t)},easeInOutCirc:function(t){return(t/=.5)<1?-0.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},easeInElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:1==(t/=1)?1:(e||(e=.3),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),-(s*Math.pow(2,10*(t-=1))*Math.sin(2*(1*t-i)*Math.PI/e)))},easeOutElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:1==(t/=1)?1:(e||(e=.3),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),s*Math.pow(2,-10*t)*Math.sin(2*(1*t-i)*Math.PI/e)+1)},easeInOutElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:2==(t/=.5)?1:(e||(e=.3*1.5),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),1>t?-.5*s*Math.pow(2,10*(t-=1))*Math.sin(2*(1*t-i)*Math.PI/e):s*Math.pow(2,-10*(t-=1))*Math.sin(2*(1*t-i)*Math.PI/e)*.5+1)},easeInBack:function(t){var i=1.70158;return 1*(t/=1)*t*((i+1)*t-i)},easeOutBack:function(t){var i=1.70158;return 1*((t=t/1-1)*t*((i+1)*t+i)+1)},easeInOutBack:function(t){var i=1.70158;return(t/=.5)<1?.5*t*t*(((i*=1.525)+1)*t-i):.5*((t-=2)*t*(((i*=1.525)+1)*t+i)+2)},easeInBounce:function(t){return 1-w.easeOutBounce(1-t)},easeOutBounce:function(t){return(t/=1)<1/2.75?7.5625*t*t:2/2.75>t?1*(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1*(7.5625*(t-=2.25/2.75)*t+.9375):1*(7.5625*(t-=2.625/2.75)*t+.984375)},easeInOutBounce:function(t){return.5>t?.5*w.easeInBounce(2*t):.5*w.easeOutBounce(2*t-1)+.5}}),b=s.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}(),P=s.cancelAnimFrame=function(){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||function(t){return window.clearTimeout(t,1e3/60)}}(),L=(s.animationLoop=function(t,i,e,s,n,o){var a=0,h=w[e]||w.linear,l=function(){a++;var e=a/i,r=h(e);t.call(o,r,e,a),s.call(o,r,e),i>a?o.animationFrame=b(l):n.apply(o)};b(l)},s.getRelativePosition=function(t){var i,e,s=t.originalEvent||t,n=t.currentTarget||t.srcElement,o=n.getBoundingClientRect();return s.touches?(i=s.touches[0].clientX-o.left,e=s.touches[0].clientY-o.top):(i=s.clientX-o.left,e=s.clientY-o.top),{x:i,y:e}},s.addEvent=function(t,i,e){t.addEventListener?t.addEventListener(i,e):t.attachEvent?t.attachEvent("on"+i,e):t["on"+i]=e}),k=s.removeEvent=function(t,i,e){t.removeEventListener?t.removeEventListener(i,e,!1):t.detachEvent?t.detachEvent("on"+i,e):t["on"+i]=c},F=(s.bindEvents=function(t,i,e){t.events||(t.events={}),n(i,function(i){t.events[i]=function(){e.apply(t,arguments)},L(t.chart.canvas,i,t.events[i])})},s.unbindEvents=function(t,i){n(i,function(i,e){k(t.chart.canvas,e,i)})}),R=s.getMaximumWidth=function(t){var i=t.parentNode;return i.clientWidth},T=s.getMaximumHeight=function(t){var i=t.parentNode;return i.clientHeight},A=(s.getMaximumSize=s.getMaximumWidth,s.retinaScale=function(t){var i=t.ctx,e=t.canvas.width,s=t.canvas.height;window.devicePixelRatio&&(i.canvas.style.width=e+"px",i.canvas.style.height=s+"px",i.canvas.height=s*window.devicePixelRatio,i.canvas.width=e*window.devicePixelRatio,i.scale(window.devicePixelRatio,window.devicePixelRatio))}),M=s.clear=function(t){t.ctx.clearRect(0,0,t.width,t.height)},W=s.fontString=function(t,i,e){return i+" "+t+"px "+e},z=s.longestText=function(t,i,e){t.font=i;var s=0;return n(e,function(i){var e=t.measureText(i).width;s=e>s?e:s}),s},B=s.drawRoundedRectangle=function(t,i,e,s,n,o){t.beginPath(),t.moveTo(i+o,e),t.lineTo(i+s-o,e),t.quadraticCurveTo(i+s,e,i+s,e+o),t.lineTo(i+s,e+n-o),t.quadraticCurveTo(i+s,e+n,i+s-o,e+n),t.lineTo(i+o,e+n),t.quadraticCurveTo(i,e+n,i,e+n-o),t.lineTo(i,e+o),t.quadraticCurveTo(i,e,i+o,e),t.closePath()};e.instances={},e.Type=function(t,i,s){this.options=i,this.chart=s,this.id=u(),e.instances[this.id]=this,i.responsive&&this.resize(),this.initialize.call(this,t)},a(e.Type.prototype,{initialize:function(){return this},clear:function(){return M(this.chart),this},stop:function(){return P(this.animationFrame),this},resize:function(t){this.stop();var i=this.chart.canvas,e=R(this.chart.canvas),s=this.options.maintainAspectRatio?e/this.chart.aspectRatio:T(this.chart.canvas);return i.width=this.chart.width=e,i.height=this.chart.height=s,A(this.chart),"function"==typeof t&&t.apply(this,Array.prototype.slice.call(arguments,1)),this},reflow:c,render:function(t){return t&&this.reflow(),this.options.animation&&!t?s.animationLoop(this.draw,this.options.animationSteps,this.options.animationEasing,this.options.onAnimationProgress,this.options.onAnimationComplete,this):(this.draw(),this.options.onAnimationComplete.call(this)),this},generateLegend:function(){return C(this.options.legendTemplate,this)},destroy:function(){this.clear(),F(this,this.events);var t=this.chart.canvas;t.width=this.chart.width,t.height=this.chart.height,t.style.removeProperty?(t.style.removeProperty("width"),t.style.removeProperty("height")):(t.style.removeAttribute("width"),t.style.removeAttribute("height")),delete e.instances[this.id]},showTooltip:function(t,i){"undefined"==typeof this.activeElements&&(this.activeElements=[]);var o=function(t){var i=!1;return t.length!==this.activeElements.length?i=!0:(n(t,function(t,e){t!==this.activeElements[e]&&(i=!0)},this),i)}.call(this,t);if(o||i){if(this.activeElements=t,this.draw(),this.options.customTooltips&&this.options.customTooltips(!1),t.length>0)if(this.datasets&&this.datasets.length>1){for(var a,h,r=this.datasets.length-1;r>=0&&(a=this.datasets[r].points||this.datasets[r].bars||this.datasets[r].segments,h=l(a,t[0]),-1===h);r--);var c=[],u=[],d=function(){var t,i,e,n,o,a=[],l=[],r=[];return s.each(this.datasets,function(i){t=i.points||i.bars||i.segments,t[h]&&t[h].hasValue()&&a.push(t[h])}),s.each(a,function(t){l.push(t.x),r.push(t.y),c.push(s.template(this.options.multiTooltipTemplate,t)),u.push({fill:t._saved.fillColor||t.fillColor,stroke:t._saved.strokeColor||t.strokeColor})},this),o=m(r),e=g(r),n=m(l),i=g(l),{x:n>this.chart.width/2?n:i,y:(o+e)/2}}.call(this,h);new e.MultiTooltip({x:d.x,y:d.y,xPadding:this.options.tooltipXPadding,yPadding:this.options.tooltipYPadding,xOffset:this.options.tooltipXOffset,fillColor:this.options.tooltipFillColor,textColor:this.options.tooltipFontColor,fontFamily:this.options.tooltipFontFamily,fontStyle:this.options.tooltipFontStyle,fontSize:this.options.tooltipFontSize,titleTextColor:this.options.tooltipTitleFontColor,titleFontFamily:this.options.tooltipTitleFontFamily,titleFontStyle:this.options.tooltipTitleFontStyle,titleFontSize:this.options.tooltipTitleFontSize,cornerRadius:this.options.tooltipCornerRadius,labels:c,legendColors:u,legendColorBackground:this.options.multiTooltipKeyBackground,title:t[0].label,chart:this.chart,ctx:this.chart.ctx,custom:this.options.customTooltips}).draw()}else n(t,function(t){var i=t.tooltipPosition();new e.Tooltip({x:Math.round(i.x),y:Math.round(i.y),xPadding:this.options.tooltipXPadding,yPadding:this.options.tooltipYPadding,fillColor:this.options.tooltipFillColor,textColor:this.options.tooltipFontColor,fontFamily:this.options.tooltipFontFamily,fontStyle:this.options.tooltipFontStyle,fontSize:this.options.tooltipFontSize,caretHeight:this.options.tooltipCaretSize,cornerRadius:this.options.tooltipCornerRadius,text:C(this.options.tooltipTemplate,t),chart:this.chart,custom:this.options.customTooltips}).draw()},this);return this}},toBase64Image:function(){return this.chart.canvas.toDataURL.apply(this.chart.canvas,arguments)}}),e.Type.extend=function(t){var i=this,s=function(){return i.apply(this,arguments)};if(s.prototype=o(i.prototype),a(s.prototype,t),s.extend=e.Type.extend,t.name||i.prototype.name){var n=t.name||i.prototype.name,l=e.defaults[i.prototype.name]?o(e.defaults[i.prototype.name]):{};e.defaults[n]=a(l,t.defaults),e.types[n]=s,e.prototype[n]=function(t,i){var o=h(e.defaults.global,e.defaults[n],i||{});return new s(t,o,this)}}else d("Name not provided for this chart, so it hasn't been registered");return i},e.Element=function(t){a(this,t),this.initialize.apply(this,arguments),this.save()},a(e.Element.prototype,{initialize:function(){},restore:function(t){return t?n(t,function(t){this[t]=this._saved[t]},this):a(this,this._saved),this},save:function(){return this._saved=o(this),delete this._saved._saved,this},update:function(t){return n(t,function(t,i){this._saved[i]=this[i],this[i]=t},this),this},transition:function(t,i){return n(t,function(t,e){this[e]=(t-this._saved[e])*i+this._saved[e]},this),this},tooltipPosition:function(){return{x:this.x,y:this.y}},hasValue:function(){return f(this.value)}}),e.Element.extend=r,e.Point=e.Element.extend({display:!0,inRange:function(t,i){var e=this.hitDetectionRadius+this.radius;return Math.pow(t-this.x,2)+Math.pow(i-this.y,2)<Math.pow(e,2)},draw:function(){if(this.display){var t=this.ctx;t.beginPath(),t.arc(this.x,this.y,this.radius,0,2*Math.PI),t.closePath(),t.strokeStyle=this.strokeColor,t.lineWidth=this.strokeWidth,t.fillStyle=this.fillColor,t.fill(),t.stroke()}}}),e.Arc=e.Element.extend({inRange:function(t,i){var e=s.getAngleFromPoint(this,{x:t,y:i}),n=e.angle>=this.startAngle&&e.angle<=this.endAngle,o=e.distance>=this.innerRadius&&e.distance<=this.outerRadius;return n&&o},tooltipPosition:function(){var t=this.startAngle+(this.endAngle-this.startAngle)/2,i=(this.outerRadius-this.innerRadius)/2+this.innerRadius;return{x:this.x+Math.cos(t)*i,y:this.y+Math.sin(t)*i}},draw:function(t){var i=this.ctx;i.beginPath(),i.arc(this.x,this.y,this.outerRadius,this.startAngle,this.endAngle),i.arc(this.x,this.y,this.innerRadius,this.endAngle,this.startAngle,!0),i.closePath(),i.strokeStyle=this.strokeColor,i.lineWidth=this.strokeWidth,i.fillStyle=this.fillColor,i.fill(),i.lineJoin="bevel",this.showStroke&&i.stroke()}}),e.Rectangle=e.Element.extend({draw:function(){var t=this.ctx,i=this.width/2,e=this.x-i,s=this.x+i,n=this.base-(this.base-this.y),o=this.strokeWidth/2;this.showStroke&&(e+=o,s-=o,n+=o),t.beginPath(),t.fillStyle=this.fillColor,t.strokeStyle=this.strokeColor,t.lineWidth=this.strokeWidth,t.moveTo(e,this.base),t.lineTo(e,n),t.lineTo(s,n),t.lineTo(s,this.base),t.fill(),this.showStroke&&t.stroke()},height:function(){return this.base-this.y},inRange:function(t,i){return t>=this.x-this.width/2&&t<=this.x+this.width/2&&i>=this.y&&i<=this.base}}),e.Tooltip=e.Element.extend({draw:function(){var t=this.chart.ctx;t.font=W(this.fontSize,this.fontStyle,this.fontFamily),this.xAlign="center",this.yAlign="above";var i=this.caretPadding=2,e=t.measureText(this.text).width+2*this.xPadding,s=this.fontSize+2*this.yPadding,n=s+this.caretHeight+i;this.x+e/2>this.chart.width?this.xAlign="left":this.x-e/2<0&&(this.xAlign="right"),this.y-n<0&&(this.yAlign="below");var o=this.x-e/2,a=this.y-n;if(t.fillStyle=this.fillColor,this.custom)this.custom(this);else{switch(this.yAlign){case"above":t.beginPath(),t.moveTo(this.x,this.y-i),t.lineTo(this.x+this.caretHeight,this.y-(i+this.caretHeight)),t.lineTo(this.x-this.caretHeight,this.y-(i+this.caretHeight)),t.closePath(),t.fill();break;case"below":a=this.y+i+this.caretHeight,t.beginPath(),t.moveTo(this.x,this.y+i),t.lineTo(this.x+this.caretHeight,this.y+i+this.caretHeight),t.lineTo(this.x-this.caretHeight,this.y+i+this.caretHeight),t.closePath(),t.fill()}switch(this.xAlign){case"left":o=this.x-e+(this.cornerRadius+this.caretHeight);break;case"right":o=this.x-(this.cornerRadius+this.caretHeight)}B(t,o,a,e,s,this.cornerRadius),t.fill(),t.fillStyle=this.textColor,t.textAlign="center",t.textBaseline="middle",t.fillText(this.text,o+e/2,a+s/2)}}}),e.MultiTooltip=e.Element.extend({initialize:function(){this.font=W(this.fontSize,this.fontStyle,this.fontFamily),this.titleFont=W(this.titleFontSize,this.titleFontStyle,this.titleFontFamily),this.height=this.labels.length*this.fontSize+(this.labels.length-1)*(this.fontSize/2)+2*this.yPadding+1.5*this.titleFontSize,this.ctx.font=this.titleFont;var t=this.ctx.measureText(this.title).width,i=z(this.ctx,this.font,this.labels)+this.fontSize+3,e=g([i,t]);this.width=e+2*this.xPadding;var s=this.height/2;this.y-s<0?this.y=s:this.y+s>this.chart.height&&(this.y=this.chart.height-s),this.x>this.chart.width/2?this.x-=this.xOffset+this.width:this.x+=this.xOffset},getLineHeight:function(t){var i=this.y-this.height/2+this.yPadding,e=t-1;return 0===t?i+this.titleFontSize/2:i+(1.5*this.fontSize*e+this.fontSize/2)+1.5*this.titleFontSize},draw:function(){if(this.custom)this.custom(this);else{B(this.ctx,this.x,this.y-this.height/2,this.width,this.height,this.cornerRadius);var t=this.ctx;t.fillStyle=this.fillColor,t.fill(),t.closePath(),t.textAlign="left",t.textBaseline="middle",t.fillStyle=this.titleTextColor,t.font=this.titleFont,t.fillText(this.title,this.x+this.xPadding,this.getLineHeight(0)),t.font=this.font,s.each(this.labels,function(i,e){t.fillStyle=this.textColor,t.fillText(i,this.x+this.xPadding+this.fontSize+3,this.getLineHeight(e+1)),t.fillStyle=this.legendColorBackground,t.fillRect(this.x+this.xPadding,this.getLineHeight(e+1)-this.fontSize/2,this.fontSize,this.fontSize),t.fillStyle=this.legendColors[e].fill,t.fillRect(this.x+this.xPadding,this.getLineHeight(e+1)-this.fontSize/2,this.fontSize,this.fontSize)},this)}}}),e.Scale=e.Element.extend({initialize:function(){this.fit()},buildYLabels:function(){this.yLabels=[];for(var t=v(this.stepValue),i=0;i<=this.steps;i++)this.yLabels.push(C(this.templateString,{value:(this.min+i*this.stepValue).toFixed(t)}));this.yLabelWidth=this.display&&this.showLabels?z(this.ctx,this.font,this.yLabels):0},addXLabel:function(t){this.xLabels.push(t),this.valuesCount++,this.fit()},removeXLabel:function(){this.xLabels.shift(),this.valuesCount--,this.fit()},fit:function(){this.startPoint=this.display?this.fontSize:0,this.endPoint=this.display?this.height-1.5*this.fontSize-5:this.height,this.startPoint+=this.padding,this.endPoint-=this.padding;var t,i=this.endPoint-this.startPoint;for(this.calculateYRange(i),this.buildYLabels(),this.calculateXLabelRotation();i>this.endPoint-this.startPoint;)i=this.endPoint-this.startPoint,t=this.yLabelWidth,this.calculateYRange(i),this.buildYLabels(),t<this.yLabelWidth&&this.calculateXLabelRotation()},calculateXLabelRotation:function(){this.ctx.font=this.font;var t,i,e=this.ctx.measureText(this.xLabels[0]).width,s=this.ctx.measureText(this.xLabels[this.xLabels.length-1]).width;if(this.xScalePaddingRight=s/2+3,this.xScalePaddingLeft=e/2>this.yLabelWidth+10?e/2:this.yLabelWidth+10,this.xLabelRotation=0,this.display){var n,o=z(this.ctx,this.font,this.xLabels);this.xLabelWidth=o;for(var a=Math.floor(this.calculateX(1)-this.calculateX(0))-6;this.xLabelWidth>a&&0===this.xLabelRotation||this.xLabelWidth>a&&this.xLabelRotation<=90&&this.xLabelRotation>0;)n=Math.cos(S(this.xLabelRotation)),t=n*e,i=n*s,t+this.fontSize/2>this.yLabelWidth+8&&(this.xScalePaddingLeft=t+this.fontSize/2),this.xScalePaddingRight=this.fontSize/2,this.xLabelRotation++,this.xLabelWidth=n*o;this.xLabelRotation>0&&(this.endPoint-=Math.sin(S(this.xLabelRotation))*o+3)}else this.xLabelWidth=0,this.xScalePaddingRight=this.padding,this.xScalePaddingLeft=this.padding},calculateYRange:c,drawingArea:function(){return this.startPoint-this.endPoint},calculateY:function(t){var i=this.drawingArea()/(this.min-this.max);return this.endPoint-i*(t-this.min)},calculateX:function(t){var i=(this.xLabelRotation>0,this.width-(this.xScalePaddingLeft+this.xScalePaddingRight)),e=i/Math.max(this.valuesCount-(this.offsetGridLines?0:1),1),s=e*t+this.xScalePaddingLeft;return this.offsetGridLines&&(s+=e/2),Math.round(s)},update:function(t){s.extend(this,t),this.fit()},draw:function(){var t=this.ctx,i=(this.endPoint-this.startPoint)/this.steps,e=Math.round(this.xScalePaddingLeft);this.display&&(t.fillStyle=this.textColor,t.font=this.font,n(this.yLabels,function(n,o){var a=this.endPoint-i*o,h=Math.round(a),l=this.showHorizontalLines;t.textAlign="right",t.textBaseline="middle",this.showLabels&&t.fillText(n,e-10,a),0!==o||l||(l=!0),l&&t.beginPath(),o>0?(t.lineWidth=this.gridLineWidth,t.strokeStyle=this.gridLineColor):(t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor),h+=s.aliasPixel(t.lineWidth),l&&(t.moveTo(e,h),t.lineTo(this.width,h),t.stroke(),t.closePath()),t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor,t.beginPath(),t.moveTo(e-5,h),t.lineTo(e,h),t.stroke(),t.closePath()},this),n(this.xLabels,function(i,e){var s=this.calculateX(e)+x(this.lineWidth),n=this.calculateX(e-(this.offsetGridLines?.5:0))+x(this.lineWidth),o=this.xLabelRotation>0,a=this.showVerticalLines;0!==e||a||(a=!0),a&&t.beginPath(),e>0?(t.lineWidth=this.gridLineWidth,t.strokeStyle=this.gridLineColor):(t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor),a&&(t.moveTo(n,this.endPoint),t.lineTo(n,this.startPoint-3),t.stroke(),t.closePath()),t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor,t.beginPath(),t.moveTo(n,this.endPoint),t.lineTo(n,this.endPoint+5),t.stroke(),t.closePath(),t.save(),t.translate(s,o?this.endPoint+12:this.endPoint+8),t.rotate(-1*S(this.xLabelRotation)),t.font=this.font,t.textAlign=o?"right":"center",t.textBaseline=o?"middle":"top",t.fillText(i,0,0),t.restore()},this))}}),e.RadialScale=e.Element.extend({initialize:function(){this.size=m([this.height,this.width]),this.drawingArea=this.display?this.size/2-(this.fontSize/2+this.backdropPaddingY):this.size/2},calculateCenterOffset:function(t){var i=this.drawingArea/(this.max-this.min);return(t-this.min)*i},update:function(){this.lineArc?this.drawingArea=this.display?this.size/2-(this.fontSize/2+this.backdropPaddingY):this.size/2:this.setScaleSize(),this.buildYLabels()},buildYLabels:function(){this.yLabels=[];for(var t=v(this.stepValue),i=0;i<=this.steps;i++)this.yLabels.push(C(this.templateString,{value:(this.min+i*this.stepValue).toFixed(t)}))},getCircumference:function(){return 2*Math.PI/this.valuesCount},setScaleSize:function(){var t,i,e,s,n,o,a,h,l,r,c,u,d=m([this.height/2-this.pointLabelFontSize-5,this.width/2]),p=this.width,g=0;for(this.ctx.font=W(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily),i=0;i<this.valuesCount;i++)t=this.getPointPosition(i,d),e=this.ctx.measureText(C(this.templateString,{value:this.labels[i]})).width+5,0===i||i===this.valuesCount/2?(s=e/2,t.x+s>p&&(p=t.x+s,n=i),t.x-s<g&&(g=t.x-s,a=i)):i<this.valuesCount/2?t.x+e>p&&(p=t.x+e,n=i):i>this.valuesCount/2&&t.x-e<g&&(g=t.x-e,a=i);l=g,r=Math.ceil(p-this.width),o=this.getIndexAngle(n),h=this.getIndexAngle(a),c=r/Math.sin(o+Math.PI/2),u=l/Math.sin(h+Math.PI/2),c=f(c)?c:0,u=f(u)?u:0,this.drawingArea=d-(u+c)/2,this.setCenterPoint(u,c)},setCenterPoint:function(t,i){var e=this.width-i-this.drawingArea,s=t+this.drawingArea;this.xCenter=(s+e)/2,this.yCenter=this.height/2},getIndexAngle:function(t){var i=2*Math.PI/this.valuesCount;return t*i-Math.PI/2},getPointPosition:function(t,i){var e=this.getIndexAngle(t);return{x:Math.cos(e)*i+this.xCenter,y:Math.sin(e)*i+this.yCenter}},draw:function(){if(this.display){var t=this.ctx;if(n(this.yLabels,function(i,e){if(e>0){var s,n=e*(this.drawingArea/this.steps),o=this.yCenter-n;if(this.lineWidth>0)if(t.strokeStyle=this.lineColor,t.lineWidth=this.lineWidth,this.lineArc)t.beginPath(),t.arc(this.xCenter,this.yCenter,n,0,2*Math.PI),t.closePath(),t.stroke();else{t.beginPath();for(var a=0;a<this.valuesCount;a++)s=this.getPointPosition(a,this.calculateCenterOffset(this.min+e*this.stepValue)),0===a?t.moveTo(s.x,s.y):t.lineTo(s.x,s.y);t.closePath(),t.stroke()}if(this.showLabels){if(t.font=W(this.fontSize,this.fontStyle,this.fontFamily),this.showLabelBackdrop){var h=t.measureText(i).width;t.fillStyle=this.backdropColor,t.fillRect(this.xCenter-h/2-this.backdropPaddingX,o-this.fontSize/2-this.backdropPaddingY,h+2*this.backdropPaddingX,this.fontSize+2*this.backdropPaddingY)}t.textAlign="center",t.textBaseline="middle",t.fillStyle=this.fontColor,t.fillText(i,this.xCenter,o)}}},this),!this.lineArc){t.lineWidth=this.angleLineWidth,t.strokeStyle=this.angleLineColor;for(var i=this.valuesCount-1;i>=0;i--){if(this.angleLineWidth>0){var e=this.getPointPosition(i,this.calculateCenterOffset(this.max));t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(e.x,e.y),t.stroke(),t.closePath()}var s=this.getPointPosition(i,this.calculateCenterOffset(this.max)+5);t.font=W(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily),t.fillStyle=this.pointLabelFontColor;var o=this.labels.length,a=this.labels.length/2,h=a/2,l=h>i||i>o-h,r=i===h||i===o-h;t.textAlign=0===i?"center":i===a?"center":a>i?"left":"right",t.textBaseline=r?"middle":l?"bottom":"top",t.fillText(this.labels[i],s.x,s.y)}}}}}),s.addEvent(window,"resize",function(){var t;return function(){clearTimeout(t),t=setTimeout(function(){n(e.instances,function(t){t.options.responsive&&t.resize(t.render,!0)})},50)}}()),p?define(function(){return e}):"object"==typeof module&&module.exports&&(module.exports=e),t.Chart=e,e.noConflict=function(){return t.Chart=i,e}}).call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleBeginAtZero:!0,scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,scaleShowHorizontalLines:!0,scaleShowVerticalLines:!0,barShowStroke:!0,barStrokeWidth:2,barValueSpacing:5,barDatasetSpacing:1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"Bar",defaults:s,initialize:function(t){var s=this.options;this.ScaleClass=i.Scale.extend({offsetGridLines:!0,calculateBarX:function(t,i,e){var n=this.calculateBaseWidth(),o=this.calculateX(e)-n/2,a=this.calculateBarWidth(t);return o+a*i+i*s.barDatasetSpacing+a/2},calculateBaseWidth:function(){return this.calculateX(1)-this.calculateX(0)-2*s.barValueSpacing},calculateBarWidth:function(t){var i=this.calculateBaseWidth()-(t-1)*s.barDatasetSpacing;return i/t}}),this.datasets=[],this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getBarsAtEvent(t):[];this.eachBars(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),this.BarClass=i.Rectangle.extend({strokeWidth:this.options.barStrokeWidth,showStroke:this.options.barShowStroke,ctx:this.chart.ctx}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,bars:[]};this.datasets.push(s),e.each(i.data,function(e,n){s.bars.push(new this.BarClass({value:e,label:t.labels[n],datasetLabel:i.label,strokeColor:i.strokeColor,fillColor:i.fillColor,highlightFill:i.highlightFill||i.fillColor,highlightStroke:i.highlightStroke||i.strokeColor}))},this)},this),this.buildScale(t.labels),this.BarClass.prototype.base=this.scale.endPoint,this.eachBars(function(t,i,s){e.extend(t,{width:this.scale.calculateBarWidth(this.datasets.length),x:this.scale.calculateBarX(this.datasets.length,s,i),y:this.scale.endPoint}),t.save()},this),this.render()},update:function(){this.scale.update(),e.each(this.activeElements,function(t){t.restore(["fillColor","strokeColor"])}),this.eachBars(function(t){t.save()}),this.render()},eachBars:function(t){e.each(this.datasets,function(i,s){e.each(i.bars,t,this,s)},this)},getBarsAtEvent:function(t){for(var i,s=[],n=e.getRelativePosition(t),o=function(t){s.push(t.bars[i])},a=0;a<this.datasets.length;a++)for(i=0;i<this.datasets[a].bars.length;i++)if(this.datasets[a].bars[i].inRange(n.x,n.y))return e.each(this.datasets,o),s;return s},buildScale:function(t){var i=this,s=function(){var t=[];return i.eachBars(function(i){t.push(i.value)}),t},n={templateString:this.options.scaleLabel,height:this.chart.height,width:this.chart.width,ctx:this.chart.ctx,textColor:this.options.scaleFontColor,fontSize:this.options.scaleFontSize,fontStyle:this.options.scaleFontStyle,fontFamily:this.options.scaleFontFamily,valuesCount:t.length,beginAtZero:this.options.scaleBeginAtZero,integersOnly:this.options.scaleIntegersOnly,calculateYRange:function(t){var i=e.calculateScaleRange(s(),t,this.fontSize,this.beginAtZero,this.integersOnly);e.extend(this,i)},xLabels:t,font:e.fontString(this.options.scaleFontSize,this.options.scaleFontStyle,this.options.scaleFontFamily),lineWidth:this.options.scaleLineWidth,lineColor:this.options.scaleLineColor,showHorizontalLines:this.options.scaleShowHorizontalLines,showVerticalLines:this.options.scaleShowVerticalLines,gridLineWidth:this.options.scaleShowGridLines?this.options.scaleGridLineWidth:0,gridLineColor:this.options.scaleShowGridLines?this.options.scaleGridLineColor:"rgba(0,0,0,0)",padding:this.options.showScale?0:this.options.barShowStroke?this.options.barStrokeWidth:0,showLabels:this.options.scaleShowLabels,display:this.options.showScale};this.options.scaleOverride&&e.extend(n,{calculateYRange:e.noop,steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}),this.scale=new this.ScaleClass(n)},addData:function(t,i){e.each(t,function(t,e){this.datasets[e].bars.push(new this.BarClass({value:t,label:i,x:this.scale.calculateBarX(this.datasets.length,e,this.scale.valuesCount+1),y:this.scale.endPoint,width:this.scale.calculateBarWidth(this.datasets.length),base:this.scale.endPoint,strokeColor:this.datasets[e].strokeColor,fillColor:this.datasets[e].fillColor}))
},this),this.scale.addXLabel(i),this.update()},removeData:function(){this.scale.removeXLabel(),e.each(this.datasets,function(t){t.bars.shift()},this),this.update()},reflow:function(){e.extend(this.BarClass.prototype,{y:this.scale.endPoint,base:this.scale.endPoint});var t=e.extend({height:this.chart.height,width:this.chart.width});this.scale.update(t)},draw:function(t){var i=t||1;this.clear();this.chart.ctx;this.scale.draw(i),e.each(this.datasets,function(t,s){e.each(t.bars,function(t,e){t.hasValue()&&(t.base=this.scale.endPoint,t.transition({x:this.scale.calculateBarX(this.datasets.length,s,e),y:this.scale.calculateY(t.value),width:this.scale.calculateBarWidth(this.datasets.length)},i).draw())},this)},this)}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,percentageInnerCutout:50,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"Doughnut",defaults:s,initialize:function(t){this.segments=[],this.outerRadius=(e.min([this.chart.width,this.chart.height])-this.options.segmentStrokeWidth/2)/2,this.SegmentArc=i.Arc.extend({ctx:this.chart.ctx,x:this.chart.width/2,y:this.chart.height/2}),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getSegmentsAtEvent(t):[];e.each(this.segments,function(t){t.restore(["fillColor"])}),e.each(i,function(t){t.fillColor=t.highlightColor}),this.showTooltip(i)}),this.calculateTotal(t),e.each(t,function(t,i){this.addData(t,i,!0)},this),this.render()},getSegmentsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.segments,function(t){t.inRange(s.x,s.y)&&i.push(t)},this),i},addData:function(t,i,e){var s=i||this.segments.length;this.segments.splice(s,0,new this.SegmentArc({value:t.value,outerRadius:this.options.animateScale?0:this.outerRadius,innerRadius:this.options.animateScale?0:this.outerRadius/100*this.options.percentageInnerCutout,fillColor:t.color,highlightColor:t.highlight||t.color,showStroke:this.options.segmentShowStroke,strokeWidth:this.options.segmentStrokeWidth,strokeColor:this.options.segmentStrokeColor,startAngle:1.5*Math.PI,circumference:this.options.animateRotate?0:this.calculateCircumference(t.value),label:t.label})),e||(this.reflow(),this.update())},calculateCircumference:function(t){return 2*Math.PI*(Math.abs(t)/this.total)},calculateTotal:function(t){this.total=0,e.each(t,function(t){this.total+=Math.abs(t.value)},this)},update:function(){this.calculateTotal(this.segments),e.each(this.activeElements,function(t){t.restore(["fillColor"])}),e.each(this.segments,function(t){t.save()}),this.render()},removeData:function(t){var i=e.isNumber(t)?t:this.segments.length-1;this.segments.splice(i,1),this.reflow(),this.update()},reflow:function(){e.extend(this.SegmentArc.prototype,{x:this.chart.width/2,y:this.chart.height/2}),this.outerRadius=(e.min([this.chart.width,this.chart.height])-this.options.segmentStrokeWidth/2)/2,e.each(this.segments,function(t){t.update({outerRadius:this.outerRadius,innerRadius:this.outerRadius/100*this.options.percentageInnerCutout})},this)},draw:function(t){var i=t?t:1;this.clear(),e.each(this.segments,function(t,e){t.transition({circumference:this.calculateCircumference(t.value),outerRadius:this.outerRadius,innerRadius:this.outerRadius/100*this.options.percentageInnerCutout},i),t.endAngle=t.startAngle+t.circumference,t.draw(),0===e&&(t.startAngle=1.5*Math.PI),e<this.segments.length-1&&(this.segments[e+1].startAngle=t.endAngle)},this)}}),i.types.Doughnut.extend({name:"Pie",defaults:e.merge(s,{percentageInnerCutout:0})})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,scaleShowHorizontalLines:!0,scaleShowVerticalLines:!0,bezierCurve:!0,bezierCurveTension:.4,pointDot:!0,pointDotRadius:4,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"Line",defaults:s,initialize:function(t){this.PointClass=i.Point.extend({strokeWidth:this.options.pointDotStrokeWidth,radius:this.options.pointDotRadius,display:this.options.pointDot,hitDetectionRadius:this.options.pointHitDetectionRadius,ctx:this.chart.ctx,inRange:function(t){return Math.pow(t-this.x,2)<Math.pow(this.radius+this.hitDetectionRadius,2)}}),this.datasets=[],this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getPointsAtEvent(t):[];this.eachPoints(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,pointColor:i.pointColor,pointStrokeColor:i.pointStrokeColor,points:[]};this.datasets.push(s),e.each(i.data,function(e,n){s.points.push(new this.PointClass({value:e,label:t.labels[n],datasetLabel:i.label,strokeColor:i.pointStrokeColor,fillColor:i.pointColor,highlightFill:i.pointHighlightFill||i.pointColor,highlightStroke:i.pointHighlightStroke||i.pointStrokeColor}))},this),this.buildScale(t.labels),this.eachPoints(function(t,i){e.extend(t,{x:this.scale.calculateX(i),y:this.scale.endPoint}),t.save()},this)},this),this.render()},update:function(){this.scale.update(),e.each(this.activeElements,function(t){t.restore(["fillColor","strokeColor"])}),this.eachPoints(function(t){t.save()}),this.render()},eachPoints:function(t){e.each(this.datasets,function(i){e.each(i.points,t,this)},this)},getPointsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.datasets,function(t){e.each(t.points,function(t){t.inRange(s.x,s.y)&&i.push(t)})},this),i},buildScale:function(t){var s=this,n=function(){var t=[];return s.eachPoints(function(i){t.push(i.value)}),t},o={templateString:this.options.scaleLabel,height:this.chart.height,width:this.chart.width,ctx:this.chart.ctx,textColor:this.options.scaleFontColor,fontSize:this.options.scaleFontSize,fontStyle:this.options.scaleFontStyle,fontFamily:this.options.scaleFontFamily,valuesCount:t.length,beginAtZero:this.options.scaleBeginAtZero,integersOnly:this.options.scaleIntegersOnly,calculateYRange:function(t){var i=e.calculateScaleRange(n(),t,this.fontSize,this.beginAtZero,this.integersOnly);e.extend(this,i)},xLabels:t,font:e.fontString(this.options.scaleFontSize,this.options.scaleFontStyle,this.options.scaleFontFamily),lineWidth:this.options.scaleLineWidth,lineColor:this.options.scaleLineColor,showHorizontalLines:this.options.scaleShowHorizontalLines,showVerticalLines:this.options.scaleShowVerticalLines,gridLineWidth:this.options.scaleShowGridLines?this.options.scaleGridLineWidth:0,gridLineColor:this.options.scaleShowGridLines?this.options.scaleGridLineColor:"rgba(0,0,0,0)",padding:this.options.showScale?0:this.options.pointDotRadius+this.options.pointDotStrokeWidth,showLabels:this.options.scaleShowLabels,display:this.options.showScale};this.options.scaleOverride&&e.extend(o,{calculateYRange:e.noop,steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}),this.scale=new i.Scale(o)},addData:function(t,i){e.each(t,function(t,e){this.datasets[e].points.push(new this.PointClass({value:t,label:i,x:this.scale.calculateX(this.scale.valuesCount+1),y:this.scale.endPoint,strokeColor:this.datasets[e].pointStrokeColor,fillColor:this.datasets[e].pointColor}))},this),this.scale.addXLabel(i),this.update()},removeData:function(){this.scale.removeXLabel(),e.each(this.datasets,function(t){t.points.shift()},this),this.update()},reflow:function(){var t=e.extend({height:this.chart.height,width:this.chart.width});this.scale.update(t)},draw:function(t){var i=t||1;this.clear();var s=this.chart.ctx,n=function(t){return null!==t.value},o=function(t,i,s){return e.findNextWhere(i,n,s)||t},a=function(t,i,s){return e.findPreviousWhere(i,n,s)||t};this.scale.draw(i),e.each(this.datasets,function(t){var h=e.where(t.points,n);e.each(t.points,function(t,e){t.hasValue()&&t.transition({y:this.scale.calculateY(t.value),x:this.scale.calculateX(e)},i)},this),this.options.bezierCurve&&e.each(h,function(t,i){var s=i>0&&i<h.length-1?this.options.bezierCurveTension:0;t.controlPoints=e.splineCurve(a(t,h,i),t,o(t,h,i),s),t.controlPoints.outer.y>this.scale.endPoint?t.controlPoints.outer.y=this.scale.endPoint:t.controlPoints.outer.y<this.scale.startPoint&&(t.controlPoints.outer.y=this.scale.startPoint),t.controlPoints.inner.y>this.scale.endPoint?t.controlPoints.inner.y=this.scale.endPoint:t.controlPoints.inner.y<this.scale.startPoint&&(t.controlPoints.inner.y=this.scale.startPoint)},this),s.lineWidth=this.options.datasetStrokeWidth,s.strokeStyle=t.strokeColor,s.beginPath(),e.each(h,function(t,i){if(0===i)s.moveTo(t.x,t.y);else if(this.options.bezierCurve){var e=a(t,h,i);s.bezierCurveTo(e.controlPoints.outer.x,e.controlPoints.outer.y,t.controlPoints.inner.x,t.controlPoints.inner.y,t.x,t.y)}else s.lineTo(t.x,t.y)},this),s.stroke(),this.options.datasetFill&&h.length>0&&(s.lineTo(h[h.length-1].x,this.scale.endPoint),s.lineTo(h[0].x,this.scale.endPoint),s.fillStyle=t.fillColor,s.closePath(),s.fill()),e.each(h,function(t){t.draw()})},this)}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBeginAtZero:!0,scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,scaleShowLine:!0,segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"PolarArea",defaults:s,initialize:function(t){this.segments=[],this.SegmentArc=i.Arc.extend({showStroke:this.options.segmentShowStroke,strokeWidth:this.options.segmentStrokeWidth,strokeColor:this.options.segmentStrokeColor,ctx:this.chart.ctx,innerRadius:0,x:this.chart.width/2,y:this.chart.height/2}),this.scale=new i.RadialScale({display:this.options.showScale,fontStyle:this.options.scaleFontStyle,fontSize:this.options.scaleFontSize,fontFamily:this.options.scaleFontFamily,fontColor:this.options.scaleFontColor,showLabels:this.options.scaleShowLabels,showLabelBackdrop:this.options.scaleShowLabelBackdrop,backdropColor:this.options.scaleBackdropColor,backdropPaddingY:this.options.scaleBackdropPaddingY,backdropPaddingX:this.options.scaleBackdropPaddingX,lineWidth:this.options.scaleShowLine?this.options.scaleLineWidth:0,lineColor:this.options.scaleLineColor,lineArc:!0,width:this.chart.width,height:this.chart.height,xCenter:this.chart.width/2,yCenter:this.chart.height/2,ctx:this.chart.ctx,templateString:this.options.scaleLabel,valuesCount:t.length}),this.updateScaleRange(t),this.scale.update(),e.each(t,function(t,i){this.addData(t,i,!0)},this),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getSegmentsAtEvent(t):[];e.each(this.segments,function(t){t.restore(["fillColor"])}),e.each(i,function(t){t.fillColor=t.highlightColor}),this.showTooltip(i)}),this.render()},getSegmentsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.segments,function(t){t.inRange(s.x,s.y)&&i.push(t)},this),i},addData:function(t,i,e){var s=i||this.segments.length;this.segments.splice(s,0,new this.SegmentArc({fillColor:t.color,highlightColor:t.highlight||t.color,label:t.label,value:t.value,outerRadius:this.options.animateScale?0:this.scale.calculateCenterOffset(t.value),circumference:this.options.animateRotate?0:this.scale.getCircumference(),startAngle:1.5*Math.PI})),e||(this.reflow(),this.update())},removeData:function(t){var i=e.isNumber(t)?t:this.segments.length-1;this.segments.splice(i,1),this.reflow(),this.update()},calculateTotal:function(t){this.total=0,e.each(t,function(t){this.total+=t.value},this),this.scale.valuesCount=this.segments.length},updateScaleRange:function(t){var i=[];e.each(t,function(t){i.push(t.value)});var s=this.options.scaleOverride?{steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}:e.calculateScaleRange(i,e.min([this.chart.width,this.chart.height])/2,this.options.scaleFontSize,this.options.scaleBeginAtZero,this.options.scaleIntegersOnly);e.extend(this.scale,s,{size:e.min([this.chart.width,this.chart.height]),xCenter:this.chart.width/2,yCenter:this.chart.height/2})},update:function(){this.calculateTotal(this.segments),e.each(this.segments,function(t){t.save()}),this.reflow(),this.render()},reflow:function(){e.extend(this.SegmentArc.prototype,{x:this.chart.width/2,y:this.chart.height/2}),this.updateScaleRange(this.segments),this.scale.update(),e.extend(this.scale,{xCenter:this.chart.width/2,yCenter:this.chart.height/2}),e.each(this.segments,function(t){t.update({outerRadius:this.scale.calculateCenterOffset(t.value)})},this)},draw:function(t){var i=t||1;this.clear(),e.each(this.segments,function(t,e){t.transition({circumference:this.scale.getCircumference(),outerRadius:this.scale.calculateCenterOffset(t.value)},i),t.endAngle=t.startAngle+t.circumference,0===e&&(t.startAngle=1.5*Math.PI),e<this.segments.length-1&&(this.segments[e+1].startAngle=t.endAngle),t.draw()},this),this.scale.draw()}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers;i.Type.extend({name:"Radar",defaults:{scaleShowLine:!0,angleShowLineOut:!0,scaleShowLabels:!1,scaleBeginAtZero:!0,angleLineColor:"rgba(0,0,0,.1)",angleLineWidth:1,pointLabelFontFamily:"'Arial'",pointLabelFontStyle:"normal",pointLabelFontSize:10,pointLabelFontColor:"#666",pointDot:!0,pointDotRadius:3,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'},initialize:function(t){this.PointClass=i.Point.extend({strokeWidth:this.options.pointDotStrokeWidth,radius:this.options.pointDotRadius,display:this.options.pointDot,hitDetectionRadius:this.options.pointHitDetectionRadius,ctx:this.chart.ctx}),this.datasets=[],this.buildScale(t),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getPointsAtEvent(t):[];this.eachPoints(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,pointColor:i.pointColor,pointStrokeColor:i.pointStrokeColor,points:[]};this.datasets.push(s),e.each(i.data,function(e,n){var o;this.scale.animation||(o=this.scale.getPointPosition(n,this.scale.calculateCenterOffset(e))),s.points.push(new this.PointClass({value:e,label:t.labels[n],datasetLabel:i.label,x:this.options.animation?this.scale.xCenter:o.x,y:this.options.animation?this.scale.yCenter:o.y,strokeColor:i.pointStrokeColor,fillColor:i.pointColor,highlightFill:i.pointHighlightFill||i.pointColor,highlightStroke:i.pointHighlightStroke||i.pointStrokeColor}))},this)},this),this.render()},eachPoints:function(t){e.each(this.datasets,function(i){e.each(i.points,t,this)},this)},getPointsAtEvent:function(t){var i=e.getRelativePosition(t),s=e.getAngleFromPoint({x:this.scale.xCenter,y:this.scale.yCenter},i),n=2*Math.PI/this.scale.valuesCount,o=Math.round((s.angle-1.5*Math.PI)/n),a=[];return(o>=this.scale.valuesCount||0>o)&&(o=0),s.distance<=this.scale.drawingArea&&e.each(this.datasets,function(t){a.push(t.points[o])}),a},buildScale:function(t){this.scale=new i.RadialScale({display:this.options.showScale,fontStyle:this.options.scaleFontStyle,fontSize:this.options.scaleFontSize,fontFamily:this.options.scaleFontFamily,fontColor:this.options.scaleFontColor,showLabels:this.options.scaleShowLabels,showLabelBackdrop:this.options.scaleShowLabelBackdrop,backdropColor:this.options.scaleBackdropColor,backdropPaddingY:this.options.scaleBackdropPaddingY,backdropPaddingX:this.options.scaleBackdropPaddingX,lineWidth:this.options.scaleShowLine?this.options.scaleLineWidth:0,lineColor:this.options.scaleLineColor,angleLineColor:this.options.angleLineColor,angleLineWidth:this.options.angleShowLineOut?this.options.angleLineWidth:0,pointLabelFontColor:this.options.pointLabelFontColor,pointLabelFontSize:this.options.pointLabelFontSize,pointLabelFontFamily:this.options.pointLabelFontFamily,pointLabelFontStyle:this.options.pointLabelFontStyle,height:this.chart.height,width:this.chart.width,xCenter:this.chart.width/2,yCenter:this.chart.height/2,ctx:this.chart.ctx,templateString:this.options.scaleLabel,labels:t.labels,valuesCount:t.datasets[0].data.length}),this.scale.setScaleSize(),this.updateScaleRange(t.datasets),this.scale.buildYLabels()},updateScaleRange:function(t){var i=function(){var i=[];return e.each(t,function(t){t.data?i=i.concat(t.data):e.each(t.points,function(t){i.push(t.value)})}),i}(),s=this.options.scaleOverride?{steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}:e.calculateScaleRange(i,e.min([this.chart.width,this.chart.height])/2,this.options.scaleFontSize,this.options.scaleBeginAtZero,this.options.scaleIntegersOnly);e.extend(this.scale,s)},addData:function(t,i){this.scale.valuesCount++,e.each(t,function(t,e){var s=this.scale.getPointPosition(this.scale.valuesCount,this.scale.calculateCenterOffset(t));this.datasets[e].points.push(new this.PointClass({value:t,label:i,x:s.x,y:s.y,strokeColor:this.datasets[e].pointStrokeColor,fillColor:this.datasets[e].pointColor}))},this),this.scale.labels.push(i),this.reflow(),this.update()},removeData:function(){this.scale.valuesCount--,this.scale.labels.shift(),e.each(this.datasets,function(t){t.points.shift()},this),this.reflow(),this.update()},update:function(){this.eachPoints(function(t){t.save()}),this.reflow(),this.render()},reflow:function(){e.extend(this.scale,{width:this.chart.width,height:this.chart.height,size:e.min([this.chart.width,this.chart.height]),xCenter:this.chart.width/2,yCenter:this.chart.height/2}),this.updateScaleRange(this.datasets),this.scale.setScaleSize(),this.scale.buildYLabels()},draw:function(t){var i=t||1,s=this.chart.ctx;this.clear(),this.scale.draw(),e.each(this.datasets,function(t){e.each(t.points,function(t,e){t.hasValue()&&t.transition(this.scale.getPointPosition(e,this.scale.calculateCenterOffset(t.value)),i)},this),s.lineWidth=this.options.datasetStrokeWidth,s.strokeStyle=t.strokeColor,s.beginPath(),e.each(t.points,function(t,i){0===i?s.moveTo(t.x,t.y):s.lineTo(t.x,t.y)},this),s.closePath(),s.stroke(),s.fillStyle=t.fillColor,s.fill(),e.each(t.points,function(t){t.hasValue()&&t.draw()})},this)}})}.call(this);;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,List,UI,Next,Doc,Arrays,String,AttrProxy,T,Random,Charting,Pervasives,Color,Chart,Renderers,ChartJs,FinantialMathematics,Web,ChartingUtil,jQuery,Utilities,Client,Concurrency,Data,WBRuntime,WorldBankRuntime,Seq,View,Collections,FSharpMap,ResizeArray,ResizeArrayProxy,JavaScript,JSModule,MapModule,PrintfHelpers,Var,AttrModule;
 Runtime.Define(Global,{
  FinantialMathematics:{
   Web:{
    ChartingUtil:{
     chartDiv:function(title,chart,legend)
     {
      var arg20,arg201;
      arg201=List.ofArray([Doc.TextNode(title)]);
      arg20=List.ofArray([Doc.Element("h2",[],arg201),Doc.Async(chart),legend(null)]);
      return Doc.Element("div",[],arg20);
     },
     defaultChartConfig:function()
     {
      return{
       pointDot:false,
       bezierCurve:true,
       datasetFill:false
      };
     },
     legend:function(countries,colors)
     {
      var x,mapping,x1;
      x=Arrays.zip(colors,countries);
      mapping=function(tupledArg)
      {
       var color,countryName,arg20,arg00,arg201;
       color=tupledArg[0];
       countryName=tupledArg[1];
       arg00="width:20px;height:20px;margin-right:10px;display:inline-block;background-color:"+String(color);
       arg201=List.ofArray([Doc.TextNode(countryName)]);
       arg20=List.ofArray([Doc.Element("span",List.ofArray([AttrProxy.Create("style",arg00)]),Runtime.New(T,{
        $:0
       })),Doc.Element("span",[],arg201)]);
       return Doc.Element("div",[],arg20);
      };
      x1=Arrays.map(mapping,x);
      return Doc.Element("div",[],x1);
     },
     randomColor:Runtime.Field(function()
     {
      var r;
      r=Random.New();
      return function()
      {
       return Runtime.New(Color,{
        $:0,
        $0:r.Next1(256),
        $1:r.Next1(256),
        $2:r.Next1(256),
        $3:1
       });
      };
     }),
     renderChartLines:function(data,colors)
     {
      var mapping,array,arg00,x;
      mapping=function(tupledArg)
      {
       var c,e;
       c=tupledArg[0];
       e=tupledArg[1];
       return Chart.Line(e).__WithPointStrokeColor(c).__WithStrokeColor(c);
      };
      array=Arrays.zip(colors,data);
      arg00=Arrays.map(mapping,array);
      x=Chart.Combine(arg00);
      return ChartJs.Render2(x,{
       $:1,
       $0:{
        $:0,
        $0:750,
        $1:500
       }
      },{
       $:1,
       $0:ChartingUtil.defaultChartConfig()
      },{
       $:0
      });
     }
    },
    Client:{
     Main:Runtime.Field(function()
     {
      var arg20,arg201;
      jQuery("#main").empty();
      arg20=List.ofArray([Client.plotSelectionDoc()]);
      arg201=List.ofArray([Doc.TextView(Client.varMu().get_View())]);
      return Doc.RunById("main",Utilities.divc("panel-default",List.ofArray([Utilities.divc("panel-body",List.ofArray([Doc.Element("div",[],arg20),Doc.Element("label",[],arg201),Doc.EmbedView(Client.chartDiv())]))])));
     }),
     chart0:function()
     {
      return Concurrency.Delay(function()
      {
       var mapping,source,arg00;
       mapping=function(c)
       {
        var _this;
        _this=WorldBankRuntime.GetIndicators(c);
        return WorldBankRuntime.AsyncGetIndicator(_this,"FM.LBL.BMNY.ZG");
       };
       source=Client.countries();
       arg00=Seq.map(mapping,source);
       return Concurrency.Bind(Concurrency.Parallel(arg00),function(_arg1)
       {
        return Concurrency.Return(Client.renderChartLinesYears(_arg1));
       });
      });
     },
     chart1:function()
     {
      return Concurrency.Delay(function()
      {
       var mapping,source,arg00;
       mapping=function(c)
       {
        var _this;
        _this=WorldBankRuntime.GetIndicators(c);
        return WorldBankRuntime.AsyncGetIndicator(_this,"GFDD.OI.06");
       };
       source=Client.countries();
       arg00=Seq.map(mapping,source);
       return Concurrency.Bind(Concurrency.Parallel(arg00),function(_arg1)
       {
        return Concurrency.Return(Client.renderChartLinesYears(_arg1));
       });
      });
     },
     chartDiv:Runtime.Field(function()
     {
      var arg00,arg10;
      arg00=function(x)
      {
       var arg20;
       arg20=List.ofArray([Client["chartDiv'"](x)]);
       return Doc.Element("div",[],arg20);
      };
      arg10=Client.varMu().get_View();
      return View.Map(arg00,arg10);
     }),
     "chartDiv'":function(varMuValue)
     {
      return ChartingUtil.chartDiv(varMuValue,(Client.charts().get_Item(varMuValue))(null),function()
      {
       return Client["legent'"]();
      });
     },
     charts:Runtime.Field(function()
     {
      return FSharpMap.New1([]).Add("Broad money growth (annual %)",function()
      {
       return Client.chart0();
      }).Add("5-bank asset concentration",function()
      {
       return Client.chart1();
      });
     }),
     colors:Runtime.Field(function()
     {
      return Arrays.map(function()
      {
       return(ChartingUtil.randomColor())(null);
      },Client.countries());
     }),
     countries:Runtime.Field(function()
     {
      var _this,_this1,_this2,_this3,_this4,_this5;
      _this=Client.data();
      _this1=Client.data();
      _this2=Client.data();
      _this3=Client.data();
      _this4=Client.data();
      _this5=Client.data();
      return[WorldBankRuntime.GetCountry(_this,"AUT","Austria"),WorldBankRuntime.GetCountry(_this1,"HUN","Hungary"),WorldBankRuntime.GetCountry(_this2,"GBR","United Kingdom"),WorldBankRuntime.GetCountry(_this3,"POL","Poland"),WorldBankRuntime.GetCountry(_this4,"ARE","United Arab Emirates"),WorldBankRuntime.GetCountry(_this5,"USA","United States")];
     }),
     data:Runtime.Field(function()
     {
      return{
       serviceUrl:"http://api.worldbank.org",
       source:"World Development Indicators;Global Financial Development"
      };
     }),
     "legent'":function()
     {
      var mapping,array,countries,colors;
      mapping=function(c)
      {
       return c.Name;
      };
      array=Client.countries();
      countries=Arrays.map(mapping,array);
      colors=Client.colors();
      return ChartingUtil.legend(countries,colors);
     },
     plotDataYears:function(i)
     {
      return Seq.zip(Seq.map(function(value)
      {
       return Global.String(value);
      },ResizeArrayProxy.New(Seq.sort(Seq.map(function(value)
      {
       return value<<0;
      },JSModule.GetFieldNames(i))))),ResizeArrayProxy.New(Seq.map(function(x)
      {
       return x[1];
      },Seq.sortBy(function(tupledArg)
      {
       return tupledArg[0]<<0;
      },JSModule.GetFields(i)))));
     },
     plotSelection:Runtime.Field(function()
     {
      var mapping,table,list;
      mapping=function(tupledArg)
      {
       var k;
       k=tupledArg[0];
       tupledArg[1];
       return k;
      };
      table=Client.charts();
      list=Seq.toList(MapModule.ToSeq(table));
      return List.map(mapping,list);
     }),
     plotSelectionDoc:Runtime.Field(function()
     {
      return Doc.Select(List.ofArray([Utilities.cls("form-control")]),function(_)
      {
       return PrintfHelpers.prettyPrint(_);
      },Client.plotSelection(),Client.varMu());
     }),
     "renderChartLines'":function(data)
     {
      var colors;
      colors=Client.colors();
      return ChartingUtil.renderChartLines(data,colors);
     },
     renderChartLinesYears:function(data)
     {
      var mapping,data1;
      mapping=function(i)
      {
       return Client.plotDataYears(i);
      };
      data1=Arrays.map(mapping,data);
      return Client["renderChartLines'"](data1);
     },
     varMu:Runtime.Field(function()
     {
      return Var.Create(Client.plotSelection().get_Item(0));
     })
    }
   }
  },
  WebSharper:{
   UI:{
    Next:{
     Utilities:{
      cls:function(n)
      {
       return AttrModule.Class(n);
      },
      divc:function(c,docs)
      {
       var arg10;
       arg10=List.ofArray([Utilities.cls(c)]);
       return Doc.Element("div",arg10,docs);
      },
      href:function(txt,url)
      {
       var arg10,arg20;
       arg10=List.ofArray([AttrProxy.Create("href",url)]);
       arg20=List.ofArray([Doc.TextNode(txt)]);
       return Doc.Element("a",arg10,arg20);
      },
      sty:function(n,v)
      {
       return AttrModule.Style(n,v);
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  List=Runtime.Safe(Global.WebSharper.List);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Doc=Runtime.Safe(Next.Doc);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  String=Runtime.Safe(Global.String);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  T=Runtime.Safe(List.T);
  Random=Runtime.Safe(Global.WebSharper.Random);
  Charting=Runtime.Safe(Global.WebSharper.Charting);
  Pervasives=Runtime.Safe(Charting.Pervasives);
  Color=Runtime.Safe(Pervasives.Color);
  Chart=Runtime.Safe(Charting.Chart);
  Renderers=Runtime.Safe(Charting.Renderers);
  ChartJs=Runtime.Safe(Renderers.ChartJs);
  FinantialMathematics=Runtime.Safe(Global.FinantialMathematics);
  Web=Runtime.Safe(FinantialMathematics.Web);
  ChartingUtil=Runtime.Safe(Web.ChartingUtil);
  jQuery=Runtime.Safe(Global.jQuery);
  Utilities=Runtime.Safe(Next.Utilities);
  Client=Runtime.Safe(Web.Client);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Data=Runtime.Safe(Global.WebSharper.Data);
  WBRuntime=Runtime.Safe(Data.WBRuntime);
  WorldBankRuntime=Runtime.Safe(WBRuntime.WorldBankRuntime);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  View=Runtime.Safe(Next.View);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  MapModule=Runtime.Safe(Collections.MapModule);
  PrintfHelpers=Runtime.Safe(Global.WebSharper.PrintfHelpers);
  Var=Runtime.Safe(Next.Var);
  return AttrModule=Runtime.Safe(Next.AttrModule);
 });
 Runtime.OnLoad(function()
 {
  Client.varMu();
  Client.plotSelectionDoc();
  Client.plotSelection();
  Client.data();
  Client.countries();
  Client.colors();
  Client.charts();
  Client.chartDiv();
  Client.Main();
  ChartingUtil.randomColor();
  return;
 });
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();

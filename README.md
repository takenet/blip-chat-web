
Blip SDK for Web
======

SDK to easily add BLiP conversations (chatbots) in your Web page. For more information see [BLiP portal][1] and [BLiP documentation][2].

Installation
--------

Add the script element inside the **body** of your web page. Put your apikey as asked. *To get your apikey please enter in contact with BLiP team*
That's all :)

```html
<script src="https://unpkg.com/blip-sdk-web@0.1.7" type="text/javascript"></script>
<script>
   (function () {
      window.onload = function () {
          new BlipWebSDK.ChatBuilder()
            .withApiKey('PUT-YOUR-API-KEY-HERE')
            .build();
          }
        })();
</script>
```

Via npm
--------

If you are using ES6, simply install the `blip-sdk-web` package from the npm registry.

`npm install blip-sdk-web`

###Instantiate the BlipSdkWeb class

```javascript
import * as BlipWebSDK from 'blip-sdk-web';

new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE')
  .build();
```

Via bower
--------

`bower install blip-sdk-web`

```html
<script src="your-project/bower_components/blip-sdk-web/dist/blipWebSdk.js" type="text/javascript"></script>
<script>
  (function () {
    new BlipWebSDK.ChatBuilder()
      .withApiKey('PUT-YOUR-API-KEY-HERE')
      .build();
  })();
</script>
```

Via AMD
--------

This SDK use UMD to module export. If your project use same AMD, please use 'BlipWebSDK' identifier to resolve the library dependency.

### For instance:

A application that use dojo.js as your AMD

```html
<script src="//ajax.googleapis.com/ajax/libs/dojo/1.12.1/dojo/dojo.js"></script>
<script type="text/javascript" src="https://unpkg.com/blip-sdk-web@0.1.7"></script>

<script>
    require(['BlipWebSDK'], function (sdk) {
        new sdk.ChatBuilder()
                  .withApiKey('0070F943-4024-4FED-A3BA-BDD50D324F6E')
                  .build();
    });
</script>
```

Optional parameters
-------

You can also define optional parameters passing an object inside *build()* method, as you can see below:

| Option | Description |
| --- | --- |
| `authType` | User authentication type (BlipWebSDK.AuthType) &#8727; |
| `title` | Title of chat window |
| `target` | Target element id for embedding sdk |
| `onEnter` | Callback action on enter chat |
| `onLeave` | Callback action on leave chat |

&#8727; Possible values for authType are: 'Guest', 'Login' and 'Dev'. You can access them using 'BlipWebSDK.AuthType' class. 'Guest' type will be used as default If you do not define 'authType'.

### Example

## SDK as widget

```javascript
var options = {
    title: 'Send a message',
    onEnter: function() {
        console.log("I'm in the chat!");
    },
    onLeave: function() {
        console.log("I'm out the chat!");
    }
};

new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE')
  .build(options);
```

## SDK as embedded element using 'Login' authentication type

```javascript
var options = {
    authType: BlipWebSDK.AuthType.LOGIN_AUTH,
    title: 'Send a message',
    target: 'your-element-id',
    onEnter: function() {
        console.log("I'm in the chat!");
    },
    onLeave: function() {
        console.log("I'm out the chat!");
    }
};

new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE')
  .build(options);
```

## Advanced features

### Destroy chat widget

To destroy BLiP widget you must use a **destroy** method on chat builder variable.

### Example

```javascript
var options = {
    title: 'Send a message',
    onEnter: function() {
        console.log("I'm in the chat!");
    },
    onLeave: function() {
        console.log("I'm out the chat!");
    }
};

var chatBuilder = new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE')
  .build(options);
  
//To destroy widget use:
chatBuilder.destroy();

//To recreate widget use:
chatBuilder = new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE')
  .build(options);
```


License
-------

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.


 [1]: https://blip.ai
 [2]: https://portal.blip.ai/#/docs/home

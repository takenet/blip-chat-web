
Blip Chat for Web
======

SDK to easily add BLiP Chat widget in your Web page. Put your chatbot in your web page. For more information see [BLiP portal][1] and [BLiP documentation][2]. See supported browser versions [here](#support).

Installation
--------

Add the script element inside the **body** of your web page. Put your apikey as asked. To get your apikey go to [BLiP portal][3]. On the left menu access *Publications -> Blip Chat*. You will also need to add domains from the websites where Blip Chat is inclued, in order to enabled them in your chatbot. 
That's all :)

*For **publishing** purpose, prefer download the script and reference it locally. CDN can have availability problem and cause blip chat instability.*

```html
<script src="https://unpkg.com/blip-chat-web@1.0.3" type="text/javascript"></script>
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

If you are using ES6, simply install the `blip-chat-web` package from the npm registry.

`npm install blip-chat-web`

### Instantiate the BlipSdkWeb class

```javascript
import * as BlipWebSDK from 'blip-chat-web';

new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE')
  .build();
```

Via bower
--------

`bower install blip-chat-web`

```html
<script src="your-project/bower_components/blip-chat-web/dist/blipWebSdk.js" type="text/javascript"></script>
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
<script type="text/javascript" src="https://unpkg.com/blip-chat-web@1.0.3"></script>

<script>
    require(['BlipWebSDK'], function (sdk) {
        new sdk.ChatBuilder()
                  .withApiKey('PUT-YOUR-API-KEY-HERE')
                  .build();
    });
</script>
```

Optional parameters
-------

You can also define optional parameters passing an object inside *build()* method, as you can see below:

Options object contains three properties: 

### Config

| Propertie | Description |
| --- | --- |
| `authType` | User authentication type (BlipWebSDK.AuthType) &#8727; |
| `user` | User data with `id`, `password`, `name` and `email` properties |
| `showNotification` | Enable notification for new messages when tab is not active ** |

&#8727; Possible values for authType are: 'Guest', 'Login' and 'Dev'. You can access them using 'BlipWebSDK.AuthType' class. 'Guest' type will be used as default If you do not define 'authType'. To see more details about authentication types [click here](https://github.com/takenet/blip-chat-web/wiki/Authentication-Types)

&#8727;&#8727; The notifications are active by default. 

### Window

| Propertie | Description |
| --- | --- |
| `target` | Target element id for embedding sdk |
| `title` | Title of chat window |
| `iconPath` | Icon url for chat window |
| `zIndex`  | Define zIndex value for chat window. (Default value: 16000001) |
| `widgetColor`  | Define color value for chat widget. (Default value: '#546E7A') |
| `hideMenu` | Define if contextual menu should be hidden |

### Events

| Propertie | Description |
| --- | --- |
| `onEnter` | Callback action on enter chat |
| `onLeave` | Callback action on leave chat |

Examples
---------

### BLiP Chat as a widget

```javascript
var options = 
{
    window: {
        title: 'Send a message',        
        widgetColor: '#546E7A',
        iconPath: 'https://takenetomni.blob.core.windows.net/media-db/blip-app-white.png',
        hideMenu: false
    },
    events: {
        onEnter: function() {
            console.log("I'm in the chat!");
        },
        onLeave: function() {
            console.log("I'm out the chat!");
        }
    }
};

new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE')
  .build(options);
```

### BLiP Chat as embedded element using 'Login' authentication type and disabling notifications: 

```javascript
var options = 
{
    config: {
        authType: BlipWebSDK.AuthType.LOGIN,
        showNotification: false
    },
    window: {
        title: 'Send a message',
        target: 'your-element-id',
        hideMenu: false
    },
    events: {
        onEnter: function() {
            console.log("I'm in the chat!");
        },
        onLeave: function() {
            console.log("I'm out the chat!");
        }
    }
};

new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE')
  .build(options);
```

## Advanced features

### Destroy chat widget

To destroy BLiP Chat widget you must use a **destroy** method on chat builder variable.

### Example

```javascript
var options = 
{
    window: {
        title: 'Send a message'                              
    },
    events: {
        onEnter: function() {
            console.log("I'm in the chat!");
        },
        onLeave: function() {
            console.log("I'm out the chat!");
        }
    }
};

var chatBuilder = new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE');
chatBuilder.build(options);
  
//To destroy widget use:
chatBuilder.destroy();

//To recreate widget use:
chatBuilder = new BlipWebSDK.ChatBuilder()
  .withApiKey('PUT-YOUR-API-KEY-HERE')
  .build(options);
```
### Support
--------

* **Safari:** Version 10.1.1 or later
* **Google Chrome:**  Version 40 or later
* **Firefox:** Version 48 or later
* **Opera:** Version 35 or later
* **Microsoft EDGE:** Version 14 or later 
* **Internet Explorer:** Version 11. _Not recommended_ &#8727;

&#8727; _It is not recommended to use Internet Explorer due to some restrictions as carousel card not supported and card layout problems._

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
 [3]: https://portal.blip.ai

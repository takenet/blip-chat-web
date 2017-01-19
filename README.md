
Blip SDK for Web
======

SDK to easily add BLiP conversations in your Web page. For more information see [BLiP portal][1] and [BLiP documentation][2].

Installation
--------

Add the script element on your web page. Put your apikey as asked. *To get your apikey please enter in contact with BLiP team*
That's all :)

```html
<script>
    (function () {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = 'https://cdn.rawgit.com/takenet/blip-sdk-web/3ba6c521/Releases/0.0.3/blip-web-sdk.js';
      s.async = 1;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);

      //Execute script with custom API KEY
      window.onload=function(){
        (new BlipWebSDK.ChatBuilder)
            .withApiKey("PUT-YOUR-API-KEY-HERE")
            .build()
      }
    })();
</script>
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

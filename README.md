# 2019-MM200-PresentationTool
Repository for 2019 MM200 exam - Presentation tool

use command ``` npm install ``` to install required dependencies.


Database URI to use app without running on Heroku has been moved to separate module due to security reasons, which is ignored by git.

Create a folder named ``` secret ``` in project root directory and inside make a file named ``` secrets.js ```.
In the created .js file write following code: 
```javascript
module.exports = { 
    DATABASE_URI: " uri from heroku postgres " + "?ssl=true" 
} 
``` 



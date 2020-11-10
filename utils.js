const fs = require('fs');
const path = require('path');

//
// Eval a template string by finding fields in the given object
//
exports.evalTemplate = function(tmpl, keys) {
    let declStr = '';
    for (let [k, v] of Object.entries(keys)) {
      // make sure ENV var doesn't have spaces or wierd characters
      if (k.match(/^[a-zA-Z0-9_]+$/) && 
          v.match(/^[a-zA-Z0-9 _\-\.\/\:]+$/) && 
          v && v.length > 0) {
        declStr += `let ${k} = String.raw\`${v}\`; `;
      }
    }
    return eval(`'use strict'; ${declStr} \`${tmpl}\``);
  };

  
exports.getConfig = function() {
    return JSON.parse(exports.evalTemplate(fs.readFileSync(path.join(__dirname, '.', 'config.json')), process.env));
};

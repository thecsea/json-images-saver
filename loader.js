/**
 * Created by claudio on 22/10/17.
 */
"use strict";
// through2 is a thin wrapper around node transform streams
const loaderUtils = require('loader-utils')
const path = require('path')
const _ = require('lodash');
const jsonImagesSaver = require('./index');

module.exports = function(source) {
  this.cacheable && this.cacheable()
  let callback = this.async()
  let options = loaderUtils.getOptions(this) || {};
  let optionsCopy = _(options).cloneDeep();

  if (!this.emitFile) return this.emitError(new Error('File Loader\n\nemitFile is required from module system'));
  if (!('context' in optionsCopy)) return this.emitError(new Error('no "context" option passed'))

  optionsCopy.additional_extension = optionsCopy.additional_extension || ''

  let context = options.context || this.options.context;
  optionsCopy.images_path = loaderUtils.interpolateName(this, options.name || '[path][name]', {
    context,
    content: source,
    regExp: options.regExp,
  })

  optionsCopy.images_path = optionsCopy.images_path.substr(0,optionsCopy.images_path.length-(optionsCopy.additional_extension.length)) + '/';

  return jsonImagesSaver(source, optionsCopy, (image_path, content)=>{this.emitFile(path.normalize(image_path), content); return Promise.resolve()})
    .then((value)=> callback(null, `module.exports = ${JSON.stringify(value)}`))
    .catch((err)=>callback(err instanceof Error ? err : new Error(err)));
};

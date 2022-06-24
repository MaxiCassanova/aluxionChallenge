const ejs = require('ejs');
const path = require('path');

const createTemplate = async (template, data) => {
    const templatePath = path.join(process.cwd(), 'src', 'templates', template);
    const html = await ejs.renderFile(templatePath, data);
    return html;
}

module.exports = { createTemplate };
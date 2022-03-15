function formatFileSize(fileSize) {
    const dimensionUnits = ["Б", "КБ", "МБ"];
    var dimensionUnit = 0;
    while (fileSize > 1024) {
        fileSize /= 1024;
        dimensionUnit++;
    }
    return `${parseInt(fileSize * 10) / 10} ${dimensionUnits[dimensionUnit]}`;
}
function formatFileName(fileName) {
    if (fileName.length < 20) {
        return fileName;
    }
    return [fileName.substr(0, 14), fileName.substr(-3)].join("...");
}
function formatFileNameExt(fileNameExt) {
    var fileNameParts = fileNameExt.split("."),
        fileName = fileNameParts.slice(0, -1).join("."),
        fileExt = fileNameParts.reverse()[0];
    return [formatFileName(fileName), fileExt].join(".");
}

export {
    formatFileName, formatFileNameExt, formatFileSize
}

/**
 * @fileoverview VSO logging commands formatter
 * @author Matt Brooks (http://enable.com/)
 */

"use strict";

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns the severity of warning or error
 * @param {object} message message object to examine
 * @returns {string} severity level
 * @private
 */
function getMessageType(message) {
    if (message.fatal || message.severity === 2) {
        return "error";
    } else {
        return "warning";
    }
}

/**
 * Returns the formatted VSO logging command 
 * @param {object} result result object to examine
 * @param {object} message message object to examine
 * @returns {string} the VSO `task.logissue` issue or error logging command
 * @private
 */
function getVsoLoggingCommand(result, message) {
    var command = ["##vso[task.logissue type=", getMessageType(message), ";sourcepath=", result.filePath, ";"];
    
    if (message.line) {
        command.push("linenumber=", message.line, ";");
    }
    
    if (message.column) {
        command.push("columnnumber=", message.column, ";");
    }
    
    if (message.ruleId) {
        command.push("code=", message.ruleId, ";");
    }
    
    command.push("]", message.message);
    
    return command.join("");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {
    var output = "",
        total = 0;

    results.forEach(function(result) {
        total += result.messages.length;

        result.messages.forEach(function(message) {
            if (output.length > 0) {
                output += "\n";
            }
            
            output += getVsoLoggingCommand(result, message);
        });
    });

    return output;
};

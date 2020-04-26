/*
 * Copyright (c) 2002-2017 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import functions from "./_data/functions.json";
import procedures from "./_data/procedures.json";

export const codeMirrorSettings = {
    value: '',
    mode: "application/x-cypher-query",
    indentWithTabs: true,
    smartIndent: false,
    lineNumbers: true,
    matchBrackets: true,
    autofocus: true,
    theme: "cypher cypher-dark",
    lint: true,
    styleActiveLine: false,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    hintOptions: {
        completeSingle: false,
        closeOnUnfocus: false,
        alignWithWord: true,
        async: true,
    },
    gutters: ["cypher-hints"],
    lineWrapping: true,
    autoCloseBrackets: {
        explode: "",
    },
};

export const toProcedure = (row) => {
    const name = row[0];
    const signature = row[1].replace(row[0], "");

    let returnItems = [];
    const matches = signature.match(/\([^)]*\) :: \((.*)\)/i);

    if (matches) {
        returnItems = matches[1].split(", ").map((returnItem) => {
            const returnItemMatches = returnItem.match(/(.*) :: (.*)/);
            return {
                name: returnItemMatches[1],
                signature: returnItemMatches[2],
            };
        });
    }

    return {
        name,
        signature,
        returnItems,
    };
};

export const toSchema = (type, records) => {
    switch (type) {
        case "procedures":
            return records.map(record => {
                const proc = record.toObject();
                return toProcedure([proc.name, proc.signature])
            });
        case "functions":
            return records.map(record => {
                const func = record.toObject();
                return {
                    name: func.name,
                    signature: func.signature.replace(func.name, ""),
                };
            })
        default:
            return records.map((record) => record.get(0));
    }
};

export const neo4jSchema = {
    consoleCommands: [
        { name: ":clear" },
        { name: ":play" },
        { name: ":help", description: "this is help command" },
        {
            name: ":server",
            commands: [
                {
                    name: "user",
                    commands: [{ name: "list", description: "listdesc" }, { name: "add" }],
                },
            ],
        },
        { name: ":schema" },
        { name: ":history" },
        { name: ":queries" },
    ],
    labels: [],
    relationshipTypes: [],
    parameters: [],
    propertyKeys: [],
    functions: functions.data.map((data) => ({
        name: data.row[0],
        signature: data.row[1].replace(data.row[0], ""),
    })),
    procedures: procedures.data.map((data) => {
        return toProcedure(data.row)
    }),
};

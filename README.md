# CD24 Syntax Highlighting for Visual Studio Code

This extension provides syntax highlighting for the CD24 programming language in
Visual Studio Code. There is also a vim cmd that allows for CD24 syntax
highlighting shown below.

## Features

- Syntax highlighting for CD24 keywords, types, and constructs
- Support for CD24 file extension (`.cd`)
- Highlights comments, strings, numbers, and operators

## Installation

### From VSIX File

1. Download the `cd24-syntax-highlight.vsix` file.
2. Open Visual Studio Code.
3. Go to the Extensions view by clicking on the square icon in the left sidebar
   or pressing `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS).
4. Click on the "..." button at the top of the Extensions view.
5. Select "Install from VSIX..." from the dropdown menu.
6. Navigate to the downloaded `cd24-syntax-highlight.vsix` file and select it.
7. Click "Install" when prompted.
8. Once installed, restart Visual Studio Code.

### Alternative Installation Method (Command Line)

Extensions can also be installed via the command line with the following steps -

1. Download the `cd24-syntax-highlighting-0.0.1.vsix` file.

2. Open a terminal or command prompt.

3. Run the following command:

```bash
code --install-extension path/to/cd24-syntax-highlighting-0.0.1.vsix
```

Replace `path/to/cd24-syntax-highlight-0.0.1.vsix` with the actual path to the
downloaded file.

4. Restart Visual Studio Code.

## Usage

After installation:

1. Open a file with the `.cd` extension or manually set the language mode to
   CD24.
2. The syntax highlighting should automatically apply to your CD24 code.

## Vim Highlighting

Vim chads can simply add the following `autocmd` to their configuration files.

```
vim.api.nvim_create_autocmd({ "BufRead", "BufNewFile" }, {
    pattern = "*.cd",
    callback = function()
        vim.bo.filetype = "cd24"
        -- Function to extract custom type names
        local function get_custom_types()
            local types = {}
            local lines = vim.api.nvim_buf_get_lines(0, 0, -1, false)
            for _, line in ipairs(lines) do
                local type_name = line:match("^%s*(%w+)%s+def%s*$")
                if type_name then
                    table.insert(types, type_name)
                end
            end
            return types
        end

        -- Get custom types
        local custom_types = get_custom_types()

        local syntax_commands = [[
            syntax clear

            " Keywords
            syntax keyword cd24Keyword CD24 constants typedef def arraydef main begin end array of func void const
            syntax keyword cd24Keyword for repeat until do while if else elif switch case default
            syntax keyword cd24Keyword input return not and or xor func

            " Built-in functions
            syntax keyword cd24BuiltinFunction print printline input

            " Types
            syntax keyword cd24Type int float bool

            " Boolean literals
            syntax keyword cd24Boolean true false

            " Identifiers
            syntax match cd24Identifier "\<[a-zA-Z_][a-zA-Z0-9_]*\>"

            " Numbers
            syntax match cd24Number "\<\d\+\>"
            syntax match cd24Number "\<0x\x\+\>"
            syntax match cd24Number "\<0o\o\+\>"
            syntax match cd24Float "\<\d\+\.\d*\>"
            syntax match cd24Float "\<\d\+[eE][-+]\?\d\+\>"

            " Operators
            syntax match cd24Operator "[+\-*/%^=<>!&|]"
            syntax match cd24Operator "\(+\|--\|\*\|\/\|%\)="
            syntax match cd24Operator "=="
            syntax match cd24Operator "!="
            syntax match cd24Operator "<="
            syntax match cd24Operator ">="

            " Delimiters
            syntax match cd24Delimiter "[(),:\[\].;]"

            " Strings
            syntax region cd24String start=/"/ skip=/\\"/ end=/"/ contains=cd24StringInterpolation
            syntax match cd24StringInterpolation "\${[^}]*}" contained

            " Comments
            syntax match cd24Comment "/--.*$" contains=cd24CommentTodo
            syntax region cd24Comment start="/\*\*" end="\*\*/" contains=cd24CommentTodo
            syntax keyword cd24CommentTodo contained TODO FIXME XXX NOTE

            " Function declarations
            syntax match cd24FunctionName "\<func\s\+\zs\w\+\ze\s*(" nextgroup=cd24FunctionParen
            syntax match cd24FunctionParen "(" contained nextgroup=cd24FunctionParams
            syntax region cd24FunctionParams start="(" end=")" contained contains=cd24Type,cd24Identifier

            " Function calls
            syntax match cd24FunctionCall "\<\w\+\ze\s*("

            " Constants TODO remove
            syntax keyword cd24Constant  E

            " Error highlighting
            syntax match cd24Error "\<\d\+[a-zA-Z_]\+"

            " Highlight groups
            highlight default link cd24Keyword Keyword
            highlight default link cd24Type Type
            highlight default link cd24CustomType Type
            highlight default link cd24Identifier Identifier
            highlight default link cd24Number Number
            highlight default link cd24Float Float
            highlight default link cd24Operator Operator
            highlight default link cd24Delimiter Delimiter
            highlight default link cd24String String
            highlight default link cd24StringInterpolation Special
            highlight default link cd24Comment Comment
            highlight default link cd24CommentTodo Todo
            highlight default link cd24FunctionName Function
            highlight default link cd24FunctionParen Delimiter
            highlight default link cd24FunctionParams Normal
            highlight default link cd24FunctionCall Function
            highlight default link cd24BuiltinFunction Special
            highlight default link cd24Boolean Boolean
            highlight default link cd24Constant Constant
            highlight default link cd24Error Error
        ]]

        -- Add custom types syntax only if there are custom types
        if #custom_types > 0 then
            syntax_commands = syntax_commands
                .. [[

            " Custom types
            syntax keyword cd24CustomType ]]
                .. table.concat(custom_types, " ")
                .. [[
        ]]
        end

        vim.cmd(syntax_commands)
        print("CD24 syntax highlighting applied")
    end,
})
```

## Contributions

**All Contributions Welcome!**

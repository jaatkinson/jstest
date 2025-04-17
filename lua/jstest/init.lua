
local jstest = {
  opts = {
    auth = {}
  }
}

jstest.setup = function(opts)
  print(' -- JSTEST SETUP --')

  opts = opts or {}

  for k,v in pairs(opts) do jstest.opts[k] = v end

end
--
-- Check if Neovim and Node.js are available
if not vim.fn.has('nvim') or vim.fn.executable('node') == 0 then
  vim.api.nvim_err_writeln('simple-split: Requires Neovim and Node.js')
  return
end

-- Define the CreateSplit command with argument support
vim.api.nvim_create_user_command('CreateSplit', function(opts)
  -- Get the plugin directory
  local plugin_dir = vim.fn.fnamemodify(vim.fn.expand('<sfile>'), ':h:h:h')
  local script_path = plugin_dir .. '/index.js'

  -- Get the user-provided argument (opts.args) or empty string
  local user_input = opts.args or ''

  -- Run the Node.js script with the argument and redraw the screen
  local cmd = string.format('node %s %s', vim.fn.shellescape(script_path), vim.fn.shellescape(user_input))
  local ok, err = pcall(vim.fn.system, cmd)
  if not ok then
    vim.api.nvim_err_writeln('simple-split: Failed to run Node.js script: ' .. err)
  end
  vim.cmd('redraw!')
end, {
  desc = 'Create a split with a new buffer via Node.js',
  nargs = '?', -- Allow 0 or 1 argument
})

return jstest

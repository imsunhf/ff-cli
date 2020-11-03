#! /usr/bin/env node
const {program} = require('commander')
const prompts = require('prompts')
const fs = require('fs')
const download = require('download-git-repo')
const ora = require('ora')
// const address = 'github/imsunhf/ff-template#master'
const address = 'github.com:imsunhf/ff-template#master'

// 修改package.json 文件
const updateFile = ({projectName, version='0.0.1'}) => {
  fs.readFile(`${process.cwd()}/${projectName}/package.json`,(err, data) => {
    if (err){
      throw err
    } else {
      const package = JSON.parse(data.toString())
      package.name = projectName
      package.version = version
      let packagetostr = JSON.stringify(package, null, 4)

      fs.writeFile(`${process.cwd()}/${projectName}/package.json`, packagetostr, err => {
        if (err){
          throw err
        }
      })
    }
  })
}

// 下载仓库代码
const downloadGitRepo = (projectName) => {
  const spinner = ora('Loading').start()
  download(address, projectName, {clone: true},(err) => {
    if (err) {
      spinner.fail('下载失败')
    }else {
      spinner.stop()
      updateFile({
        projectName
      })
    }
  })
}


program
  .command('create <projectName>')
  .action(projectName => {
    downloadGitRepo(projectName)
  })
program.parse()
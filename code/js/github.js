const childProcess = require('child_process')
const cmd = (c) => c
const shell = 'bash'

const _d = new Date(),
    year = _d.getFullYear(),
    month = _d.getMonth() + 1

const config = {
    env: {
        NODE_ENV: 'production',
        encoding: 'utf8',
    },
    shell,
}

const exec = (c) => {
    return new Promise((resolve, reject) => {
        childProcess.exec(c, config, (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else {
                resolve(stdout, stderr)
            }
        })
    })
}

const github = () => {
    console.log('Depoly start.')
    exec(cmd('git status'))
        .then((stdout, stderr) => console.log(stdout, stderr))
        .then(() => exec(cmd('git pull origin master')))
        .then(() => exec(cmd('git add .')))
        .then(() =>
            exec(
                cmd(`git commit -m '${year + '年' + month + '月,Bing壁纸更新'}'`)
            )
        )
        .then(() => exec(cmd('git push')))
        .then(() => exec(cmd('Depoly done.')))
        .catch((err) => {
            console.log(err)
            exec(cmd('git checkout :'))
        })
}

// test github push 

module.exports = github

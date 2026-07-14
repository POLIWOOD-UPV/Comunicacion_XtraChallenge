const { spawnSync } = require('child_process');

const commands = [
    ['node', ['../tests/cronometro.test.js']],
    ['node', ['../tests/http-routes.test.js']]
];

for (const [cmd, args] of commands) {
    const result = spawnSync(cmd, args, { stdio: 'inherit' });
    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
}

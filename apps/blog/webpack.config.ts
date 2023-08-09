import { DefinePlugin } from 'webpack';

export function getClientEnvironment() {
  const NX_APP = /^NX_/i;

  const raw = Object.keys(process.env)
    .filter((key) => NX_APP.test(key))
    .reduce(
      (env, key) => {
        const value = process.env[key];
        if (typeof value === 'string') {
          env[key] = value;
        }
        return env;
      },
      {} as Record<string, string>,
    );

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'process.env': Object.keys(raw).reduce(
      (env, key) => {
        env[key] = JSON.stringify(raw[key]);

        return env;
      },
      {} as Record<string, string>,
    ),
  };
}

module.exports = (config: { mode: unknown; plugins: unknown[] }) => {
  config.mode = process.env['NODE_ENV'] ?? config.mode;
  config.plugins.push(new DefinePlugin(getClientEnvironment()));

  return config;
};

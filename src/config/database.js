module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5435',
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

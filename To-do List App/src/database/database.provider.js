"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const pg_1 = require("pg");
exports.databaseProvider = {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
        const pool = new pg_1.Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'todo_db',
            password: 'rukundo',
            port: 5432,
        });
        await pool.connect();
        return pool;
    },
};
//# sourceMappingURL=database.provider.js.map
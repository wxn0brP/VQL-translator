# VQL Translator

A simple tool that translates SQL queries to VQL (Valthera Query Language) format.

[DEMO](https://wxn0brp.github.io/VQL-translator/demo/)

## Overview

This library converts standard SQL queries into VQL format, which can be used with the ValtheraDB system. It provides both object-based and string-based VQL representations.

## Usage

```typescript
import { s2v, convert_VQLR_to_VQLS } from "@wxn0brp/vql-translator";

const sql = "SELECT * FROM users WHERE id = 1";
const dbName = "db";

// Get VQL object
const vql = s2v(sql, dbName);
console.log(vql);

// Get VQL string representation
const vqlString = s2v(sql, dbName, true);
console.log(vqlString);
```

## Example

Input SQL:
```sql
SELECT * FROM users WHERE id = 1
```

Output VQL object:
```json
{
  "db": "db",
  "d": {
    "find": {
      "collection": "users",
      "search": { "id": 1 }
    }
  }
}
```

## Features

- Converts SQL SELECT, UPDATE, INSERT, DELETE operations to VQL
- Supports both single and multiple record operations
- Provides both object and string representations of VQL
- Handles complex queries with search conditions, options, and selections

## License

MIT [License](LICENSE)

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.
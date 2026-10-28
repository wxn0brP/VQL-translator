import { ValtheraQuery } from "@wxn0brp/db-string-query/types";
import { VQL_Query, VQL_Query_Relation } from "@wxn0brp/vql-client/vql";
import { normalizeFieldName, normalizeSearch, renameKeys } from "./utils";

export function convertDbToVql(res: ValtheraQuery, dbName: string): VQL_Query {
	const { query, method } = res;

	const baseStructure = {
		db: dbName,
		d: {},
	};

	renameKeys(query, "dbFindOpts", "options");
	renameKeys(query, "findOpts", "searchOpts");
	normalizeQueryIdentifiers(query);

	Object.keys(query).forEach(key => {
		if (key === "search") return;
		const value = query[key];
		if (typeof value === "object" && Object.keys(value).length === 0) {
			delete query[key];
		}
	});

	baseStructure.d = {
		[method]: query,
	};

	return baseStructure as VQL_Query;
}

function normalizeQueryIdentifiers(query: any) {
	const collection = query.collection;

	if (Array.isArray(query.searchOpts?.select)) {
		query.searchOpts.select = query.searchOpts.select.map((field: string) =>
			normalizeFieldName(field, collection),
		);
	}

	if (Array.isArray(query.searchOpts?.exclude)) {
		query.searchOpts.exclude = query.searchOpts.exclude.map((field: string) =>
			normalizeFieldName(field, collection),
		);
	}

	if (query.search) {
		query.search = normalizeSearch(query.search, collection);
	}

	if (typeof query.options?.sortBy === "string") {
		query.options.sortBy = normalizeFieldName(query.options.sortBy);
	}

	if (typeof query.options?.groupBy === "string") {
		query.options.groupBy = normalizeFieldName(query.options.groupBy);
	} else if (Array.isArray(query.options?.groupBy)) {
		query.options.groupBy = query.options.groupBy.map((field: string) =>
			normalizeFieldName(field),
		);
	}
}

export function convertRelationVql(res: ValtheraQuery): VQL_Query_Relation {
	const { relation } = res;
	const findOpts = relation[3];
	const dbFindOpts = relation[4];

	return {
		r: {
			path: relation[0],
			search: relation[1],
			relations: relation[2],
			...(dbFindOpts && Object.keys(dbFindOpts).length
				? {
						options: dbFindOpts,
					}
				: {}),
			...(findOpts?.select
				? {
						select: findOpts.select,
					}
				: {}),
			many: true,
		},
	};
}

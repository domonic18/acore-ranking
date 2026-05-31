import { DataSource } from 'typeorm';

/**
 * Base repository providing generic query operations.
 * All domain repositories should extend this class.
 */
export abstract class BaseRepository {
  protected readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async rawQuery<R = unknown>(query: string, parameters?: unknown[]): Promise<R[]> {
    return this.dataSource.query(query, parameters);
  }
}

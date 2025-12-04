import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { OkPacket, RowDataPacket } from 'mysql2';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}

  private pool() {
    return this.db.getPool();
  }

  /** CREATE POSITION */
  async createPosition(
    positions_code: string,
    positions_name: string,
    user_id: number,
  ) {
    if (!positions_code?.trim())
      throw new Error('Position code is required.');
    if (!positions_name?.trim())
      throw new Error('Position name is required.');

    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO positions (positions_code, positions_name, id)
       VALUES (?, ?, ?)`,
      [positions_code.trim(), positions_name.trim(), user_id],
    );

    return {
      positions_id: result.insertId,
      positions_code,
      positions_name,
      user_id,
    };
  }

  /** GET ALL POSITIONS */
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT positions_id, positions_code, positions_name, id, created_at, updated_at
       FROM positions`
    );
    return rows;
  }

  /** FIND ONE BY ID */
  async findById(positions_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT positions_id, positions_code, positions_name, id, created_at, updated_at
       FROM positions
       WHERE positions_id = ?`,
      [positions_id]
    );

    if (!rows.length)
      throw new NotFoundException(`Position with ID ${positions_id} not found`);

    return rows[0];
  }

  /** UPDATE POSITION */
  async updatePosition(
    positions_id: number,
    partial: { positions_code?: string; positions_name?: string },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.positions_code) {
      fields.push('positions_code = ?');
      values.push(partial.positions_code.trim());
    }
    if (partial.positions_name) {
      fields.push('positions_name = ?');
      values.push(partial.positions_name.trim());
    }

    if (!fields.length)
      return this.findById(positions_id);

    values.push(positions_id);

    await this.pool().execute<OkPacket>(
      `UPDATE positions SET ${fields.join(', ')} WHERE positions_id = ?`,
      values
    );

    return this.findById(positions_id);
  }

  /** DELETE POSITION */
  async deletePosition(positions_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      `DELETE FROM positions WHERE positions_id = ?`,
      [positions_id]
    );

    if (result.affectedRows === 0)
      throw new NotFoundException(`Position with ID ${positions_id} not found`);

    return { message: `Position with ID ${positions_id} deleted successfully` };
  }
}

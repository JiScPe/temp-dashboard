import { Connection, RowDataPacket } from "mysql2";

export async function getAttendanceData(connection: Connection, plant: string) {
  const sql = `select
                    count(*) as total,
                    SUM(case when TimeIn is not null then 1 else 0 end) as act,
                    divisionName
                from
                    tbhtcstafftime
                where
                    ScanDate = curdate()
                    and Plant = '${plant}'
                    and DivisionName not in ('RF EMC', 'RF R&D')
                group by
                    divisionName;`;
  return connection.query<RowDataPacket[]>(sql);
}
import "reflect-metadata";
import express, { Router } from "express";
import { DataSource, Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

const app = express();
app.use(express.json());
const port = 3000;

const appDataSource = new DataSource({
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: "postgres",
   password: "hello",
   database: "typeorm_db",
   entities: [User],
   synchronize: true,
   logging: true
});

@Entity()
class User extends BaseEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   firstname: string;

   @Column()
   lastname: string;

   @Column()
   email: string;
}


const studentRouter = Router();

let students: { id: number; firstName: string; lastName: string; rollNumber: string }[] = [];
let currentId = 1;

studentRouter.get("/", (req, res) => {
   res.send(students);
});

studentRouter.post("/", (req, res) => {
   const { firstName, lastName, rollNumber } = req.body;
   const newStudent = { id: currentId++, firstName, lastName, rollNumber };
   students.push(newStudent);
   res.json(newStudent);
});

studentRouter.get("/:id", (req, res) => {
   const studentId = parseInt(req.params.id);
   const student = students.find((s) => s.id === studentId);
   if (!student) return res.status(404).json({ message: "Student not found" });
   res.json(student);
});

studentRouter.put("/:id", (req, res) => {
   const studentId = parseInt(req.params.id);
   const studentIndex = students.findIndex((s) => s.id === studentId);
   if (studentIndex === -1) return res.status(404).json({ message: "Student not found" });
   const { firstName, lastName, rollNumber } = req.body;
   students[studentIndex] = { id: studentId, firstName, lastName, rollNumber };
   res.json(students[studentIndex]);
});

studentRouter.delete("/:id", (req, res) => {
   const studentId = parseInt(req.params.id);
   const studentIndex = students.findIndex((s) => s.id === studentId);
   if (studentIndex === -1) return res.status(404).json({ message: "Student not found" });
   students.splice(studentIndex, 1);
   res.json({ message: "Student deleted successfully" });
});

appDataSource.initialize().then(() => {
   console.log("Database connected successfully");

   app.get("/", (req, res) => {
      res.send("Hello from Express");
   });


   app.use("/students", studentRouter);

   app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
   });
}).catch((err) => {
   console.log("Error connecting database:", err);
});

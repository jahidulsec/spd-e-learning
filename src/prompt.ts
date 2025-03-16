import inquirer from "inquirer";

// async function main() {
//   const answers = await inquirer.prompt([
//     {
//       type: "input",
//       name: "name",
//       message: "Enter your name:",
//     },
//     {
//       type: "input",
//       name: "username",
//       message: "Enter your username:",
//     },
//     {
//       type: "password",
//       name: "password",
//       message: "Enter your password:",
//       mask: "*",
//     },
//     {
//       type: "list",
//       name: "role",
//       message: "Select your role:",
//       choices: ["admin", "superadmin"],
//     },
//   ]);


//   // create admin user
//   await db.admins.create({
//     data: {
//       username: answers.username,
//       name: answers.name,
//       password: await hashPassword(answers.password),
//       role: answers.role,
//     }
//   })

//   console.log(
//     `Welcome, ${answers.username}! You are signed up as ${answers.role}.`
//   );
// }

// main()
//   .then(async () => {
//     await db.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await db.$disconnect();
//     process.exit(1);
//   });

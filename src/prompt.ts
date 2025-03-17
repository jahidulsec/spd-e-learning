import inquirer from "inquirer";
import db from "./db/db";
import { hashPassword } from "./utils/password";

async function main() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter your name:",
    },
    {
      type: "input",
      name: "mobile",
      message: "Enter your mobile:",
    },
    {
      type: "input",
      name: "sap_id",
      message: "Enter your sap id:",
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
    },
    {
      type: "list",
      name: "role",
      message: "Select your role:",
      choices: ["superadmin", "mios", "team_lead", "director"],
    },
  ]);

  // create admin user
  await db.users.create({
    data: {
      sap_id: answers.sap_id,
      full_name: answers.name,
      password: await hashPassword(answers.password),
      role: answers.role,
      mobile: answers.mobile,
    },
  });

  console.log(
    `Welcome, ${answers.name}! You are signed up as ${answers.role}.`
  );
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });

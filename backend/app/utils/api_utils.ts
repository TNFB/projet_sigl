import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import bcrypt from 'bcrypt'

// Définissez une interface pour le résultat
interface UserResult {
  id_user: number
  email: string
  password: string
  name: string
  last_name: string
  role: string
  telephone: string
}

export async function findUserByEmail(email: string): Promise<UserResult | null> {
  return (await User.query()
    .where('email', email)
    .select('id_user', 'email', 'password', 'name', 'last_name', 'role', 'telephone')
    .first()) as UserResult | null
}

export async function findUserById(id: number): Promise<UserResult | null> {
  return (await User.query()
    .where('id_user', id)
    .select('id_user', 'email', 'password', 'name', 'last_name', 'role', 'telephone')
    .first()) as UserResult | null
}

export async function isUserTableEmpty(): Promise<boolean> {
  const count = await db.from('users').count('* as total').first()
  return count?.total === 0
}

export async function isValidRole(email: string, requiredRole: string): Promise<boolean> {
  try {
    const userRole = await db.from('users').where('email', email).select('role')

    return userRole[0]?.role === requiredRole
  } catch (error) {
    console.error('Error verifying role:', error)
    return false
  }
}

export async function generatePassword() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function findOrCreateEducationalTutor(email_educational_tutors: string): Promise<UserResult> {
  // Vérifier si l'utilisateur existe
  let educationalTutor = await findUserByEmail(email_educational_tutors);

  if (!educationalTutor) {
    // L'utilisateur n'existe pas, on le crée
    const password = await generatePassword();
    console.log(`Educational Tutor Email : ${email_educational_tutors} & password: ${password}`);
    
    const [newUserId] = await db.table('users').insert({
      email: email_educational_tutors,
      password: await bcrypt.hash(password, 10),
      role: 'educational_tutors',
      // Ajoutez d'autres champs si nécessaire
    }).returning('id_user');

    educationalTutor = {
      id_user: newUserId,
      email: email_educational_tutors,
      password: await bcrypt.hash(password, 10),
      name: "",
      last_name: "",
      role: 'educational_tutors',
      telephone: ""
    };
  } else if (educationalTutor.role !== 'educational_tutors') {
    // L'utilisateur existe mais n'a pas le bon rôle, on le met à jour
    await db.from('users')
      .where('id_user', educationalTutor.id_user)
      .update({ role: 'educational_tutors' });
    
    educationalTutor.role = 'educational_tutors';
  }

  // Vérifier si l'entrée existe dans la table educational_tutors
  const existingEntry = await db.from('educational_tutors')
    .where('id', educationalTutor.id_user)
    .first();

  if (!existingEntry) {
    // Créer l'entrée dans la table educational_tutors
    await db.table('educational_tutors').insert({
      id: educationalTutor.id_user
    });
  }

  return educationalTutor as UserResult;
}


export async function findOrCreateApprenticeMaster(
  email_apprentice_masters: string,
  name_apprentice_masters: string,
  last_name_apprentice_masters: string,
  telephone_apprentice_masters: string,
  company_id: number
): Promise<UserResult> {
  // Vérifier si l'utilisateur existe
  let apprenticeMaster = await findUserByEmail(email_apprentice_masters);

  if (!apprenticeMaster) {
    // L'utilisateur n'existe pas, on le crée
    const password = await generatePassword();
    console.log(`Apprentice Master Email : ${email_apprentice_masters} & password: ${password}`);
    
    const [newUserId] = await db.table('users').insert({
      email: email_apprentice_masters,
      password: await bcrypt.hash(password, 10),
      role: 'apprentice_masters',
      name: name_apprentice_masters,
      last_name: last_name_apprentice_masters,
      telephone: telephone_apprentice_masters
    }).returning('id_user');

    apprenticeMaster = {
      id_user: newUserId,
      email: email_apprentice_masters,
      password: await bcrypt.hash(password, 10),
      role: 'apprentice_masters',
      name: name_apprentice_masters,
      last_name: last_name_apprentice_masters,
      telephone: telephone_apprentice_masters
    };
  } else if (apprenticeMaster.role !== 'apprentice_masters') {
    // L'utilisateur existe mais n'a pas le bon rôle, on le met à jour
    await db.from('users')
      .where('id_user', apprenticeMaster.id_user)
      .update({ 
        role: 'apprentice_masters',
        name: name_apprentice_masters,
        last_name: last_name_apprentice_masters,
        telephone: telephone_apprentice_masters
      });
    
    apprenticeMaster = {
      ...apprenticeMaster,
      role: 'apprentice_masters',
      name: name_apprentice_masters,
      last_name: last_name_apprentice_masters,
      telephone: telephone_apprentice_masters
    };
  }

  // Vérifier si l'entrée existe dans la table apprentice_masters
  const existingEntry = await db.from('apprentice_masters')
    .where('id', apprenticeMaster.id_user)
    .first();

  if (!existingEntry) {
    // Créer l'entrée dans la table apprentice_masters
    await db.table('apprentice_masters').insert({
      id: apprenticeMaster.id_user,
      id_company: company_id
    });
  }

  return apprenticeMaster as UserResult;
}

export async function createApprenticeWithTrainingDiary(
  apprenticeUserId: number,
  educationalTutorId: number,
  apprenticeMasterId: number,
  companyId: number,
  cursusId: number // Assurez-vous d'avoir cette information
): Promise<void> {
  try {
    // Vérifier si l'apprenti existe déjà dans la table apprentices
    const existingApprentice = await db
      .from('apprentices')
      .where('id', apprenticeUserId)
      .first();

    if (!existingApprentice) {
      // Créer un nouveau training diary
      const [insertedId] = await db
        .table('training_diaries')
        .insert({
          semester_grades: JSON.stringify({}),
          document_list: JSON.stringify([]),
          evaluation: 0,
          list_interview: JSON.stringify([]),
          list_report: JSON.stringify([]),
          list_presentation: JSON.stringify([]),
          created_at: new Date()
        })
        .returning('id_training_diary');

      // Créer l'entrée dans la table apprentices
      await db.table('apprentices').insert({
        id: apprenticeUserId,
        id_educational_tutor: educationalTutorId,
        id_apprentice_master: apprenticeMasterId,
        id_cursus: cursusId,
        id_training_diary: insertedId,
        id_company: companyId,
        list_missions: JSON.stringify([])
      });

      console.log(`New apprentice created with ID: ${apprenticeUserId}`);
    } else {
      console.log(`Apprentice with ID ${apprenticeUserId} already exists`);
    }
  } catch (error) {
    console.error('Error creating apprentice with training diary:', error);
    throw error;
  }
}


interface Company {
  id_company: number;
  name: string;
}

export async function getOrCreateCompanyIdByName(companyName: string): Promise<number> {
  try {
    // Chercher l'entreprise
    let company = await db
      .from('companies')
      .where('name', companyName)
      .select('id_company')
      .first() as Company | undefined;

    // Si l'entreprise n'existe pas, la créer
    if (!company) {
      const [insertedId] = await db
        .table('companies')
        .insert({ name: companyName })
        .returning('id_company');
      
      console.log(`New company created: ${companyName} with ID: ${insertedId}`);
      return insertedId;
    }

    return company.id_company;
  } catch (error) {
    console.error('Error fetching or creating company:', error);
    throw error; // Vous pouvez choisir de gérer l'erreur différemment si nécessaire
  }
}

interface Cursus {
  id_cursus: number;
  promotion_name: string;
}

export async function findOrCreateCursus(cursusName: string): Promise<number> {
  try {
    // Chercher le cursus
    let cursus = await db
      .from('cursus')
      .where('promotion_name', cursusName)
      .select('id_cursus')
      .first() as Cursus | undefined;

    // Si le cursus n'existe pas, le créer
    if (!cursus) {
      const [insertedId] = await db
        .table('cursus')
        .insert({ promotion_name: cursusName })
        .returning('id_cursus');

      console.log(`New cursus created: ${cursusName} with ID: ${insertedId}`);
      return insertedId;
    }

    return cursus.id_cursus;
  } catch (error) {
    console.error('Error fetching or creating cursus:', error);
    throw error;
  }
}
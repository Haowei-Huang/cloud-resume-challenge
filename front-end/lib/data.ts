import portfolioData from '@/data/portfolio-data.json';

export const data = portfolioData;

export function getNavItems() {
    return data.navigation;
}

export function getPersonalData() {
    return data.personal;
}

export function getAboutMe() {
    return data.aboutMe;
}

export function getEducationData() {
    return data.education;
}

export function getExperienceData() {
    return data.experience;
}

export function getSkillsData() {
    return data.technical_skills;
}

export function getProjectsData() {
    return data.projects;
}



// One Piece Themed Mock Database with Recruits

export type User = {
    id: number;
    username: string;
    password?: string;
    role: 'pirate' | 'marine' | 'gorosei' | 'legend' | 'admin';
    bounty?: string;
    devil_fruit?: string;
    secret_ambition?: string;
    image?: string;
};

export type Post = {
    id: number;
    content: string;
    author: string;
    timestamp: string;
};

// Initial Data
export const USERS: User[] = [
    { id: 1, username: 'Imu', password: 'the_empty_throne_is_mine', role: 'admin', bounty: 'Unknown', devil_fruit: 'Unknown', secret_ambition: 'OPS{THE_ONE_PIECE_IS_REAL_BUT_HIDDEN}', image: '/images/imu.jpg' },
    { id: 2, username: 'Monkey D. Luffy', password: 'meat', role: 'pirate', bounty: '3,000,000,000', devil_fruit: 'Hito Hito no Mi, Model: Nika', secret_ambition: 'Become King of the Pirates!', image: '/images/luffy.jpg' },
    { id: 4, username: 'Sakazuki (Akainu)', password: 'absolute_justice', role: 'marine', bounty: 'N/A', devil_fruit: 'Magu Magu no Mi', secret_ambition: 'Eradicate all pirates.', image: '/images/akainu.jpg' },
    { id: 16, username: 'Gol D. Roger', role: 'legend', bounty: '5,564,800,000', devil_fruit: 'None', secret_ambition: 'Turn the world upside down', image: '/images/roger.jpg' },
];

export const POSTS: Post[] = [
    { id: 1, content: 'Anyone seen Zoro? He got lost again.', author: 'Sanji', timestamp: '2024-05-01' },
    { id: 2, content: 'Mugiwara is at Egghead Island!', author: 'Morgans', timestamp: '2024-05-02' }
];

export const STRAW_HATS = [
    { name: 'Monkey D. Luffy', image: '/images/luffy.jpg', role: 'Captain' },
    { name: 'Roronoa Zoro', image: '/images/zoro.jpg', role: 'Swordsman' },
    { name: 'Nami', image: '/images/nami.jpg', role: 'Navigator' },
    { name: 'Usopp', image: '/images/usopp.jpg', role: 'Sniper' },
    { name: 'Sanji', image: '/images/sanji.jpg', role: 'Cook' },
    { name: 'Chopper', image: '/images/chopper.jpg', role: 'Doctor' },
    { name: 'Nico Robin', image: '/images/robin.jpg', role: 'Archaeologist' },
    { name: 'Franky', image: '/images/franky.jpg', role: 'Shipwright' },
    { name: 'Brook', image: '/images/brook.jpg', role: 'Musician' },
    { name: 'Jinbe', image: '/images/jinbe.jpg', role: 'Helmsman' },
];

export const MARINES = [
    { name: 'Sakazuki (Akainu)', image: '/images/akainu.jpg', role: 'Fleet Admiral' },
    { name: 'Borsalino (Kizaru)', image: '/images/kizaru.jpg', role: 'Admiral' },
    { name: 'Kuzan (Aokiji)', image: '/images/aokiji.jpg', role: 'Former Admiral' },
    { name: 'Fujitora', image: '/images/fujitora.jpg', role: 'Admiral' },
    { name: 'Monkey D. Garp', image: '/images/garp.jpg', role: 'Vice Admiral (Hero)' },
    { name: 'Sengoku', image: '/images/sengoku.jpg', role: 'Former Fleet Admiral' },
    { name: 'Smoker', image: '/images/smoker.jpg', role: 'Vice Admiral' },
    { name: 'Koby', image: '/images/koby.jpg', role: 'Captain' },
];

export const RECRUITABLE_PIRATES = [
    ...STRAW_HATS,
    { name: 'Trafalgar Law', image: '/images/law.jpg', role: 'Captain (Heart Pirates)' },
    { name: 'Eustass Kid', image: '/images/kid.jpg', role: 'Captain (Kid Pirates)' },
    { name: 'Buggy', image: '/images/buggy.jpg', role: 'Yonko' }
];

export function dangerousQuery(username: string): User | null {
    if (username.toLowerCase().includes("' or '1'='1") || username.toLowerCase().includes("' or 1=1")) {
        return { id: 1, username: 'Imu', role: 'admin', image: '/images/imu.jpg' } as User;
    }
    return USERS.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

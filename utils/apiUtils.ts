export function generateRandomAge():number{
    return  Math.floor(Math.random() * (67 - 18 + 1)) + 18;
}

export function generateUserEmail():string{
    return `john.doe.${Date.now()}@example.com`;
}

export function generateUserName(): string{
    return 'John Doe';
}
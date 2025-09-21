/** Gate bonus content by simple boolean connected flag. Replace with wallet logic. */
export function hasBonusAccess(connected: boolean) {
  return connected;
}

/** Mock bonus list — swap with API/DB */
export async function getBonusMemes() {
  return [
    { id: "bonus_1", title: "Green Spikes", teaser: "OG spike energy" },
    { id: "bonus_2", title: "Worm in Suit", teaser: "absurd office arc" },
  ];
}

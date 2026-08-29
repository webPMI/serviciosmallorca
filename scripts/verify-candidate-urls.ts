import https from "node:https";

const candidateUrls = [
  "https://upload.wikimedia.org/wikipedia/commons/5/5a/Catedral_de_Santa_Mar%C3%ADa%2C_Palma_de_Mallorca%2C_Espa%C3%B1a%2C_2022-10-06%2C_DD_01-03_HDR.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/f2/Catedral_de_Santa_Mar%C3%ADa%2C_Palma_de_Mallorca%2C_Espa%C3%B1a%2C_2022-10-06%2C_DD_04-06_HDR.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6c/Catedral_de_Santa_Mar%C3%ADa%2C_Palma_de_Mallorca%2C_Espa%C3%B1a%2C_2022-10-06%2C_DD_16-18_HDR.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/f9/Palma_de_Mallorca_%28Spain%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/19/PALMA_de_MALLORCA%2C_AB-331.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/dc/Venus_%28super_yacht_designed_by_Philippe_Starck%29%2C_Port_de_Palma%2C_Majorca%2C_Spain_-_2022-08-20.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/34/View_from_Pla%C3%A7a_de_Santa_Catarina_in_Port_de_S%C3%B3ller_03.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/bd/Pla%C3%A7a_de_Santa_Catarina_in_Port_de_S%C3%B3ller_01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/51/View_from_Pla%C3%A7a_de_Santa_Catarina_in_Port_de_S%C3%B3ller_08.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_village_of_Valldemossa_in_Mallorca%2C_Spain_%2848001682373%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/90/Lemon_trees_in_the_village_of_Valldemossa_in_Mallorca%2C_Spain_%2848001697501%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/87/Forest_area_in_the_north_of_Mallorca%2C_close_the_the_historic_village_of_Valldemossa-July_2024.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/03/To_The_Lighthouse...-5167842680.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/cd/Mallorca_-_Palma_de_Mallorca_-_Castell_de_Bellver_1.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/eb/Bellver_Castle_Palma_de_Mallorca_interior.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/bf/Bellver_Castle_Palma_de_Mallorca_Donjon.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/dc/Port_de_S%C3%B3ller_01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/99/Port_de_Pollen%C3%A7a.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/f7/Valldemossa_-_panoramio_%281%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c7/Catedral_de_Palma_de_Mallorca.jpg",
];

function checkUrl(url: string): Promise<{ url: string; ok: boolean; status?: number }> {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { "User-Agent": "ServiciosMallorca/1.0 (info@serviciosmallorca.com)" } }, (res) => {
        resolve({ url, ok: res.statusCode === 200, status: res.statusCode });
      })
      .on("error", () => resolve({ url, ok: false }));
  });
}

async function run() {
  console.log("Checking candidate URLs on Wikimedia Commons...");
  for (const u of candidateUrls) {
    const res = await checkUrl(u);
    console.log(`${res.ok ? "✅" : "❌"} [${res.status}]: ${u}`);
  }
}

run();

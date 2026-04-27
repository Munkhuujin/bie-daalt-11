import { CacheFactory } from "../../lib";
import { InvalidConfigError } from "../../lib";
import type { Cache } from "../../lib";

/**
 * LFU cache-н unit тестүүд.
 *
 * Хамгийн чухал нь хамгийн цөөн ашигласан key устах ёстой гэдгийг
 * шалгах. Tie-breaking-г ч жаахан туршсан.
 */
describe("LFU Cache", () => {
  let cache: Cache<number>;

  beforeEach(() => {
    cache = CacheFactory.create<number>("lfu", { capacity: 3 });
  });

  // ─── Үндсэн үйлдлүүд ────────────────────────────────────

  test("set and get work", () => {
    cache.set("A", 1);
    expect(cache.get("A")).toBe(1);
  });

  test("returns null for missing key", () => {
    expect(cache.get("missing")).toBeNull();
  });

  test("delete and clear work", () => {
    cache.set("A", 1);
    cache.set("B", 2);
    expect(cache.delete("A")).toBe(true);
    expect(cache.has("A")).toBe(false);

    cache.clear();
    expect(cache.size()).toBe(0);
  });

  // ─── LFU логик (хамгийн чухал) ──────────────────────────

  // A-г олон удаа get хийгээд D нэмэхэд хамгийн цөөн freq-тэй С устах ёстой
  test("evicts least frequently used key", () => {
    cache.set("A", 1);
    cache.set("B", 2);
    cache.set("C", 3);

    // A → freq 4 (1 set + 3 get), B → freq 2 (1 set + 1 get), C → freq 1 (set л)
    cache.get("A");
    cache.get("A");
    cache.get("A");
    cache.get("B");

    cache.set("D", 4); // C устах ёстой

    expect(cache.has("A")).toBe(true);
    expect(cache.has("B")).toBe(true);
    expect(cache.has("C")).toBe(false);
    expect(cache.has("D")).toBe(true);
  });

  // Ижил freq байвал эртнийг устгах (Map insertion order)
  test("breaks ties using insertion order", () => {
    cache.set("A", 1);
    cache.set("B", 2);
    cache.set("C", 3);
    // Бүгд freq = 1 — eviction үед эхэнд орсон A устна

    cache.set("D", 4);

    expect(cache.has("A")).toBe(false); // A эртний болохоор устсан
    expect(cache.has("B")).toBe(true);
    expect(cache.has("C")).toBe(true);
    expect(cache.has("D")).toBe(true);
  });
});
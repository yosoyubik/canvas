// import type { Adapter } from '@sveltejs/kit';

// const adapter: Adapter = {
//   name: 'MAGIC',
//   async adapt(utils): Promise<void> {
//     console.log('TODO...', utils);
//   }
// };

// export default adapter;

/**
 * @param {{
 *   pages?: string;
 *   assets?: string;
 *   fallback?: string;
 * }} [opts]
 */
export default function () {
  /** @type {import('@sveltejs/kit').Adapter} */
  const adapter = {
    name: 'URBIT',

    async adapt({ utils }) {
      console.log('TODO...', utils);
    }
  };

  return adapter;
}

// export enum BtnSize {
//   SMALL = 'small',
//   LARGE = 'large',
// }


export type Team = {
  id: string
  description: string
  questions: {[index: number]: {'answer': string}}
}

// export interface PropsIcon {
//   left?: {
//     name: string
//     colorFill: string
//     size: string
//   }
//   right?: {
//     name: string
//     colorFill: string
//     size: string
//   }
// }

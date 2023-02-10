import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';

export type RouteDocument = Route & Document;

@Schema()
export class Route {
  @Prop()
  _id: string;

  @Prop()
  title: string;

  @Prop(
    raw({
      lat: { type: Number },
      long: { type: Number },
    }),
  )
  startPosition: { lat: number; long: number };

  @Prop(
    raw({
      lat: { type: Number },
      long: { type: Number },
    }),
  )
  endPosition: { lat: number; long: number };
}

export const RouteSchema = SchemaFactory.createForClass(Route);

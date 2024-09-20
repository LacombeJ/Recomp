import React from 'react';

import { Shiki } from '@recomp/shiki';
import '../stories.scss';

export default {
  title: 'Components/Shiki',
  component: Shiki,
  argTypes: {},
};

const Template = (args) => <Shiki {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  language: 'js',
  children: 'const component = "Shiki";\n\n// Shiki code component\n',
};

const TemplateDisplay = (args) => (
  <div>
    <div>
      <Shiki {...args} inline={false}>
        {'// Block display for multi-line code\nconst display = "Block";'}
      </Shiki>
    </div>
    <div>
      <Shiki {...args} inline={true}>
        {'const display = "inline"; // inline for single line span'}
      </Shiki>
    </div>
    <div>
      <Shiki {...args} inline={true}>
        {'const display = "inline"; // inline for single line span'}
      </Shiki>
    </div>
    <div>
      <Shiki {...args} inline={true}>
        {'const display = "inline"; // inline for single line span'}
      </Shiki>
    </div>
  </div>
);

export const Display = TemplateDisplay.bind({});
Display.args = {};

// code from https://shiki.matsu.io/
const scrollWidthText = `using KCTest.Infrastructure.Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace KCTest.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<KCTestContext>();
                db.Database.Migrate();
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
`;

const scrollHeightText = `structure Point (α : Type u) where
  mk :: (x : α) (y : α)
  deriving Repr

#check Point       -- a Type
#check @Point.rec  -- the eliminator
#check @Point.mk   -- the constructor
#check @Point.x    -- a projection
#check @Point.y    -- a projection

#eval Point.x (Point.mk 10 20)
#eval Point.y (Point.mk 10 20)

open Point

example (a b : α) : x (mk a b) = a :=
  rfl

example (a b : α) : y (mk a b) = b :=
  rfl

def p := Point.mk 10 20

def Point.smul (n : Nat) (p : Point Nat) :=
  Point.mk (n * p.x) (n * p.y)

def xs : List Nat := [1, 2, 3]
def f : Nat → Nat := fun x => x * x

#eval xs.map f  -- [1, 4, 9]


structure MyStruct where
    {α : Type u}
    {β : Type v}
    a : α
    b : β

#check { a := 10, b := true : MyStruct }


structure Point (α : Type u) where
  x : α
  y : α
  z : α

structure RGBValue where
  red : Nat
  green : Nat
  blue : Nat

structure RedGreenPoint (α : Type u) extends Point α, RGBValue where
  no_blue : blue = 0

def p : Point Nat :=
  { x := 10, y := 10, z := 20 }

def rgp : RedGreenPoint Nat :=
  { p with red := 200, green := 40, blue := 0, no_blue := rfl }

example : rgp.x   = 10 := rfl
example : rgp.red = 200 := rfl


class Add (a : Type) where
  add : a → a → a

instance [Add a] : Add (Array a) where
  add x y := Array.zipWith x y (· + ·)

instance [Inhabited a] [Inhabited b] : Inhabited (a × b) where
  default := (default, default)


#print inferInstance

def foo : Inhabited (Nat × Nat) :=
  inferInstance

theorem ex : foo.default = (default, default) :=
  rfl

structure Rational where
  num : Int
  den : Nat
  inv : den ≠ 0

instance : OfNat Rational n where
  ofNat := { num := n, den := 1, inv := by decide }

instance : ToString Rational where
  toString r := s!"{r.num}/{r.den}"

#eval (2 : Rational) -- 2/1

#check (2 : Rational) -- Rational
#check (2 : Nat)      -- Nat

class HMul (α : Type u) (β : Type v) (γ : outParam (Type w)) where
  hMul : α → β → γ

export HMul (hMul)

@[default_instance]
instance : HMul Int Int Int where
  hMul := Int.mul

local instance : Add Point where
  add a b := { x := a.x + b.x, y := a.y + b.y }

attribute [-instance] addPoint

namespace Point

scoped instance : Add Point where
  add a b := { x := a.x + b.x, y := a.y + b.y }

def double (p : Point) :=
  p + p

end Point

open Classical
noncomputable scoped
instance (priority := low) propDecidable (a : Prop) : Decidable a :=
  choice <| match em a with
    | Or.inl h => ⟨isTrue h⟩
    | Or.inr h => ⟨isFalse h⟩
`;

const TemplateScroll = (args) => <div>
  <div style={{ maxWidth: '500px' }}><Shiki language='c#' children={scrollWidthText} /></div>
  <div style={{ maxHeight: '500px' }}><Shiki style={{ maxHeight: '500px' }} language='lean4' children={scrollHeightText} /></div>
</div>;
export const Scroll = TemplateScroll.bind({});
Scroll.args = {};


const customLanguage = {
  name: 'custom',
  scopeName: 'source.custom',
  patterns: [
    {
      include: '#comments',
    },
    {
      match: '\\b(let|function|if|while|for|return)\\b',
      name: 'keyword.custom',
    },
    {
      match: '\\b(import|export)\\b',
      name: 'entity.name.operator',
    },
    {
      match: '\\b([A-Z][a-zA-Z0-9_.]*)\\b',
      name: 'entity.name.type.class',
    },
    {
      begin: '"',
      end: '"',
      name: 'string.quoted.double.custom',
      patterns: [
        {
          match: '\\\\[\\\\"ntr\']',
          name: 'constant.character.escape.custom',
        },
        {
          match: '\\\\x[0-9A-Fa-f][0-9A-Fa-f]',
          name: 'constant.character.escape.custom',
        },
        {
          match: '\\\\u[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]',
          name: 'constant.character.escape.custom',
        },
      ],
    },
    {
      name: 'string.quoted.single.custom',
      match: "'[^\\\\']'",
    },
    {
      name: 'string.quoted.single.custom',
      match:
        "'(\\\\(x[0-9A-Fa-f][0-9A-Fa-f]|u[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]|.))'",
      captures: {
        '1': {
          name: 'constant.character.escape.custom',
        },
      },
    },
    {
      match:
        '\\b([0-9]+|0([xX][0-9a-fA-F]+)|[-]?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?)\\b',
      name: 'constant.numeric.custom',
    },
  ],
  repository: {
    dashComment: {
      begin: '--',
      end: '$',
      name: 'comment.line.double-dash.custom',
    },
    blockComment: {
      begin: '/-',
      end: '-/',
      name: 'comment.block.custom',
      patterns: [
        {
          include: '#blockComment',
        },
      ],
    },
    comments: {
      patterns: [
        {
          include: '#dashComment',
        },
        {
          include: '#blockComment',
        },
      ],
    },
  },
};

const customText = `
import standard

-- Line comment starting with (--)

let str = "Hello world"
print(str)

function add(a, b):
  return a + b

let counter = 0
while counter < 10:
  counter += 1

for (i=0; i<counter; i++):
  if i % 2 == 0:
    print(i)

export add
`;

export const Custom = Template.bind({});
Custom.args = {
  language: customLanguage,
  children: customText,
};